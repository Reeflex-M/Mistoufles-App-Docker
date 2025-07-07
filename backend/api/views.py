from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from .serializers import UserSerializer, AnimalSerializer, FASerializer, UserSerializer, StatutSerializer, ProvenanceSerializer, SexeSerializer, CategorieSerializer, ArchiveSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Animal, FA, Statut, Provenance, Sexe, Categorie, Archive, Image
from rest_framework.parsers import MultiPartParser, FormParser

#ANIMAL
class AnimalListCreate(generics.ListCreateAPIView):
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Animal.objects.all()
    
    #Return all animal
    def get_queryset(self):
        queryset = Animal.objects.select_related('statut', 'fa').all()
        return queryset.prefetch_related('provenance', 'categorie', 'sexe')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            animal = serializer.save()
            # Récupérer l'animal avec toutes ses relations
            updated_serializer = self.get_serializer(animal)
            return Response(updated_serializer.data, status=status.HTTP_201_CREATED)
        print("Erreurs de validation:", serializer.errors)  # Debug
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()

class AnimalDelete(generics.DestroyAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]

#animal update
class AnimalUpdate(generics.UpdateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  #utilise id animal comme parametre de recherche

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        print("Données reçues pour mise à jour:", request.data)

        try:
            # Mise à jour des champs simples
            editable_fields = [
                'nom_animal', 'date_arrivee', 'date_naissance', 'num_identification',
                'primo_vacc', 'rappel_vacc', 'vermifuge', 'antipuce',
                'sterilise', 'biberonnage', 'note'
            ]

            for field in editable_fields:
                if field in request.data:
                    # Si la valeur est une chaîne vide ou None, on met explicitement None
                    value = request.data[field]
                    if value == "" or value is None:
                        setattr(instance, field, None)
                    else:
                        setattr(instance, field, value)

            # Mise à jour de la FA
            if 'fa' in request.data:
                if request.data['fa'] is not None:
                    try:
                        fa = FA.objects.get(id_fa=request.data['fa'])
                        instance.fa = fa
                    except FA.DoesNotExist:
                        return Response(
                            {"error": "FA non trouvée"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    instance.fa = None

            # Mise à jour de la provenance
            if 'provenance' in request.data:
                try:
                    provenance = Provenance.objects.get(id_provenance=request.data['provenance'])
                    instance.provenance = provenance
                except Provenance.DoesNotExist:
                    return Response(
                        {"error": "Provenance non trouvée"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Mise à jour de la catégorie
            if 'categorie' in request.data:
                try:
                    categorie = Categorie.objects.get(id_categorie=request.data['categorie'])
                    instance.categorie = categorie
                except Categorie.DoesNotExist:
                    return Response(
                        {"error": "Catégorie non trouvée"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Mise à jour du sexe
            if 'sexe' in request.data:
                try:
                    sexe = Sexe.objects.get(id_sexe=request.data['sexe'])
                    instance.sexe = sexe
                except Sexe.DoesNotExist:
                    return Response(
                        {"error": "Sexe non trouvé"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Mise à jour du statut si présent
            if 'statut' in request.data:
                try:
                    statut = Statut.objects.get(id_statut=request.data['statut'])
                    if statut.libelle_statut.lower() in ["adopté", "mort naturelle", "mort euthanasie", "transfert refuge", "chat libre","autres"]:
                        try:
                            # Créer une archive
                            print(f"Tentative d'archivage pour l'animal: {instance.nom_animal}")
                            archive = Archive.objects.create(
                                nom_animal=instance.nom_animal,
                                date_naissance=instance.date_naissance,
                                num_identification=instance.num_identification,
                                primo_vacc=instance.primo_vacc,
                                rappel_vacc=instance.rappel_vacc,
                                vermifuge=instance.vermifuge,
                                antipuce=instance.antipuce,
                                sterilise=instance.sterilise,
                                note=instance.note,
                                statut=statut,
                                provenance=instance.provenance,
                                categorie=instance.categorie,
                                sexe=instance.sexe,
                                fa=instance.fa
                            )
                            print(f"Archive créée avec succès, ID: {archive.id_animal}")
                            
                            # Supprimer les images avant de supprimer l'animal
                            Image.objects.filter(animal_reference=instance).delete()
                            
                            # Forcer la suppression de l'instance
                            Animal.objects.filter(pk=instance.pk).delete()
                            print(f"Animal {instance.nom_animal} supprimé avec succès")
                            
                            return Response({
                                "message": f"Animal {instance.nom_animal} archivé et supprimé avec succès"
                            }, status=status.HTTP_200_OK)
                        
                        except Exception as e:
                            return Response({
                                "error": "Erreur lors de l'archivage/suppression",
                                "details": str(e)
                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    instance.statut = statut
                except Statut.DoesNotExist:
                    return Response(
                        {"error": "Statut non trouvé"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Sauvegarder les modifications
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la sauvegarde: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AnimalArchiveList(generics.ListAPIView):
    serializer_class = ArchiveSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Archive.objects.select_related(
            'statut', 'provenance', 'categorie', 'sexe', 'fa'
        ).all()

class AnimalImagesView(generics.GenericAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Modifié pour utiliser animal_reference au lieu de animal_id
            images = Image.objects.filter(animal_reference=pk)
            data = [{
                'id': img.id_image,
                'url': request.build_absolute_uri(img.image.url),
                'date': img.date_upload
            } for img in images]
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def post(self, request, pk):
        try:
            animal = Animal.objects.get(id_animal=pk)
            image = request.FILES.get('image')
            if not image:
                return Response({'error': 'No image provided'}, status=400)
            
            new_image = Image.objects.create(
                animal_reference=animal,  # Modifié ici
                image=image
            )
            return Response({
                'id': new_image.id_image,
                'url': request.build_absolute_uri(new_image.image.url),
                'date': new_image.date_upload
            })
        except Animal.DoesNotExist:
            return Response({'error': 'Animal not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class ImageDeleteView(generics.DestroyAPIView):
    queryset = Image.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

#FA
class FAListCreate(generics.ListCreateAPIView):
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    
    #Return all fa
    def get_queryset(self):
        return FA.objects.all()
    
    # Correction du nom de la méthode
    def perform_create(self, serializer):  
        serializer.save()  

class FAUpdate(generics.UpdateAPIView):
    queryset = FA.objects.all()
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        print("Données reçues pour mise à jour FA:", request.data)

        # Liste des champs modifiables
        editable_fields = [
            'prenom_fa',
            'commune_fa',
            'telephone_fa',
            'email_fa',  # Ajout de email_fa ici
            'libelle_reseausociaux',
            'libelle_veterinaire',
            'note'
        ]

        for field in editable_fields:
            if field in request.data:
                setattr(instance, field, request.data[field])

        instance.save()
        serializer = self.get_serializer(instance)
        print("Données sauvegardées:", serializer.data)  # Debug log
        return Response(serializer.data)

class FADetail(generics.RetrieveAPIView):
    queryset = FA.objects.all()
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'  #utilise id fa comme parametre de recherche

class FAWithoutAnimalsView(generics.ListAPIView):
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Récupère les FAs qui n'ont pas d'animaux associés
        return FA.objects.filter(animal__isnull=True)

class FADelete(generics.DestroyAPIView):
    queryset = FA.objects.all()
    serializer_class = FASerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.animal_set.exists():
                return Response(
                    {"error": "Impossible de supprimer un bénévole qui a des animaux associés"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Statut
class StatutList(generics.ListAPIView):
    queryset = Statut.objects.all()
    serializer_class = StatutSerializer
    permission_classes = [IsAuthenticated]

# Provenance
class ProvenanceList(generics.ListAPIView):
    queryset = Provenance.objects.all()
    serializer_class = ProvenanceSerializer
    permission_classes = [IsAuthenticated]

# Sexe
class SexeList(generics.ListAPIView):
    queryset = Sexe.objects.all()
    serializer_class = SexeSerializer
    permission_classes = [IsAuthenticated]

# Catégorie
class CategorieList(generics.ListAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]

#USER
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# Supprimez la classe HistoriqueList

class ArchiveViewSet(viewsets.ModelViewSet):
    queryset = Archive.objects.all()
    serializer_class = ArchiveSerializer