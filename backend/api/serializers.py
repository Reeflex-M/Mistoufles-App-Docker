from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Animal, Statut, FA, Provenance, Sexe, Categorie, Archive

#User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
#Statut
class StatutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statut
        fields = ['id_statut', 'libelle_statut']

#Provenance
class ProvenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provenance
        fields = ['id_provenance', 'libelle_provenance']

#Categorie
class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id_categorie', 'libelle_categorie']

#Sexe
class SexeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sexe
        fields = ['id_sexe', 'libelle_sexe']

#FA
class FASerializer(serializers.ModelSerializer):
    nombre_animaux = serializers.SerializerMethodField()

    class Meta:
        model = FA
        fields = [
            "id_fa",
            "prenom_fa",
            "commune_fa",
            "telephone_fa",
            "email_fa",  # Ajout de email_fa ici
            "libelle_reseausociaux",
            "libelle_veterinaire",
            "note",
            "nombre_animaux"  # Ajout du nouveau champ
        ]

    def get_nombre_animaux(self, obj):
        return obj.animal_set.count()
        
#Animal
class AnimalSerializer(serializers.ModelSerializer):
    fa = FASerializer(read_only=True)  
    statut = StatutSerializer(read_only=True) 
    provenance = ProvenanceSerializer(read_only=True) 
    categorie = CategorieSerializer(read_only=True)   
    sexe = SexeSerializer(read_only=True)             
    statut_libelle = serializers.SerializerMethodField()
    provenance_libelle = serializers.SerializerMethodField()
    categorie_libelle = serializers.SerializerMethodField()
    sexe_libelle = serializers.SerializerMethodField()
    fa_libelle = serializers.SerializerMethodField()
    date_naissance = serializers.DateField(
        format='%d/%m/%Y',
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        allow_null=True,
        required=False
    )
    date_arrivee = serializers.DateField(
        format='%d/%m/%Y',
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        allow_null=True,
        required=False
    )
    primo_vacc = serializers.DateField(
        format="%d/%m/%Y",
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        required=False,
        allow_null=True
    )
    rappel_vacc = serializers.DateField(
        format="%d/%m/%Y",
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        required=False,
        allow_null=True
    )
    vermifuge = serializers.DateField(
        format="%d/%m/%Y",
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        required=False,
        allow_null=True
    )
    antipuce = serializers.DateField(
        format="%d/%m/%Y",
        input_formats=['%Y-%m-%d', '%d/%m/%Y'],
        required=False,
        allow_null=True
    )

    class Meta:
        model = Animal
        fields = '__all__'

    def get_statut_libelle(self, obj):
        return obj.statut.libelle_statut if obj.statut else None

    def get_provenance_libelle(self, obj):
        return obj.provenance.libelle_provenance if obj.provenance else None

    def get_categorie_libelle(self, obj):
        return obj.categorie.libelle_categorie if obj.categorie else None

    def get_sexe_libelle(self, obj):
        return obj.sexe.libelle_sexe if obj.sexe else None

    def get_fa_libelle(self, obj):
        return obj.fa.prenom_fa if obj.fa else None

    def create(self, validated_data):
        statut_id = self.initial_data.get('statut')
        fa_id = self.initial_data.get('fa')
        provenance_id = self.initial_data.get('provenance') 
        categorie_id = self.initial_data.get('categorie')    
        sexe_id = self.initial_data.get('sexe')             
        
        #creer animal sans relation
        animal = Animal.objects.create(**validated_data)
        
        # Gérer le statut (par défaut "en cours" si non spécifié)
        if statut_id:
            try:
                animal.statut = Statut.objects.get(id_statut=statut_id)
            except Statut.DoesNotExist:
                pass
        else:
            # Si aucun statut n'est spécifié, utiliser "en cours"
            statut_en_cours, created = Statut.objects.get_or_create(libelle_statut="en cours")
            animal.statut = statut_en_cours

        if fa_id:
            try:
                animal.fa = FA.objects.get(id_fa=fa_id)
            except FA.DoesNotExist:
                pass

        if provenance_id:  
            try:
                animal.provenance = Provenance.objects.get(id_provenance=provenance_id)
            except Provenance.DoesNotExist:
                pass
        else:
            # Si aucune provenance n'est spécifiée, utiliser "Fourrière"
            provenance_fourriere, created = Provenance.objects.get_or_create(libelle_provenance="Fourrière")
            animal.provenance = provenance_fourriere

        if categorie_id:  
            try:
                animal.categorie = Categorie.objects.get(id_categorie=categorie_id)
            except Categorie.DoesNotExist:
                pass
        else:
            # Si aucune catégorie n'est spécifiée, utiliser "Chat"
            categorie_chat, created = Categorie.objects.get_or_create(libelle_categorie="Chat")
            animal.categorie = categorie_chat

        if sexe_id:  
            try:
                animal.sexe = Sexe.objects.get(id_sexe=sexe_id)
            except Sexe.DoesNotExist:
                pass
        else:
            # Si aucun sexe n'est spécifié, utiliser "male"
            sexe_male, created = Sexe.objects.get_or_create(libelle_sexe="male")
            animal.sexe = sexe_male

        animal.save()
        return animal

    def update(self, instance, validated_data):
        # Mettre à jour tous les champs simples
        for attr, value in validated_data.items():
            # Gérer spécifiquement le cas où num_identification est None ou vide
            if attr == 'num_identification' and not value:
                setattr(instance, attr, None)
            else:
                setattr(instance, attr, value)

        # Gérer les relations si elles sont présentes dans les données initiales
        if 'statut' in self.initial_data:
            try:
                instance.statut = Statut.objects.get(id_statut=self.initial_data['statut'])
            except Statut.DoesNotExist:
                pass

        if 'provenance' in self.initial_data:
            try:
                instance.provenance = Provenance.objects.get(id_provenance=self.initial_data['provenance'])
            except Provenance.DoesNotExist:
                pass

        if 'categorie' in self.initial_data:
            try:
                instance.categorie = Categorie.objects.get(id_categorie=self.initial_data['categorie'])
            except Categorie.DoesNotExist:
                pass

        if 'sexe' in self.initial_data:
            try:
                instance.sexe = Sexe.objects.get(id_sexe=self.initial_data['sexe'])
            except Sexe.DoesNotExist:
                pass

        instance.save()
        return instance

class ArchiveSerializer(serializers.ModelSerializer):
    statut = StatutSerializer(read_only=True)
    provenance = ProvenanceSerializer(read_only=True)
    categorie = CategorieSerializer(read_only=True)
    sexe = SexeSerializer(read_only=True)
    fa = FASerializer(read_only=True)

    class Meta:
        model = Archive
        fields = '__all__'
