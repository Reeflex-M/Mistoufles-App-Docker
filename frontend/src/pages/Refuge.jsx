import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PropTypes from "prop-types";
import { ListSubheader, useMediaQuery, IconButton } from "@mui/material";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { compareStringsNoAccent } from "../utils/stringUtils";

// Popup Onclick fa_libelle
const FaDialog = ({ open, onClose, faData }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle className="bg-gray-50 border-b px-6 py-4">
        <div className="text-xl font-medium text-gray-900">
          Informations Famille d'Accueil
        </div>
      </DialogTitle>
      <DialogContent className="px-6 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Coordonnées
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Prénom</span>
                  <span className="text-gray-900">
                    {faData?.prenom_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Commune</span>
                  <span className="text-gray-900">
                    {faData?.commune_fa || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Contact
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Téléphone</span>
                  <span className="text-gray-900">
                    {faData?.telephone_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Email</span>
                  <span className="text-gray-900">
                    {faData?.email_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Réseaux</span>
                  <span className="text-gray-900">
                    {faData?.libelle_reseausociaux || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Suivi */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Suivi médical
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">
                    Vétérinaire
                  </span>
                  <span className="text-gray-900">
                    {faData?.libelle_veterinaire || "N/A"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 w-32 text-sm pt-1">Note</span>
                  <span className="text-gray-900 flex-1 whitespace-pre-wrap">
                    {faData?.note || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
        >
          Fermer
        </button>
      </DialogActions>
    </Dialog>
  );
};

// Ajouter ce nouveau composant pour la popup d'images
const ImageDialog = ({ open, onClose, animalId, animalName }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${animalId}/images/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
    }
  };

  useEffect(() => {
    if (open && animalId) {
      fetchImages();
    }
  }, [open, animalId]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${animalId}/images/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const newImage = await response.json();
      setImages((prev) => [...prev, newImage]);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/image/${imageId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleImageClick = (img) => {
    setFullscreenImage(img);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Gérer chaque fichier
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const formData = new FormData();
      formData.append("image", file);
      setUploading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/${animalId}/images/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const newImage = await response.json();
        setImages((prev) => [...prev, newImage]);
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Erreur lors de l'upload de l'image");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-50 border-b px-6 py-4">
          Photos de {animalName}
        </DialogTitle>
        <DialogContent className="p-6">
          <div
            className={`space-y-4 ${
              isDragging
                ? "bg-blue-50 border-2 border-dashed border-blue-400"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
                multiple
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                {uploading ? "Upload en cours..." : "Ajouter une photo"}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                ou glissez-déposez vos images ici
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(img)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche le déclenchement du onClick de l'image
                      handleDelete(img.id);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Fermer
          </button>
        </DialogActions>
      </Dialog>

      {/* Dialog plein écran pour l'image */}
      <Dialog
        open={!!fullscreenImage}
        onClose={() => setFullscreenImage(null)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent className="relative p-0 bg-black flex items-center justify-center min-h-[80vh]">
          {fullscreenImage && (
            <>
              <img
                src={fullscreenImage.url}
                alt=""
                className="max-h-[80vh] max-w-full object-contain"
              />
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

//composant NoteDialog
const NoteDialog = ({ isOpen, onClose, note = "", onSave }) => {
  const [noteText, setNoteText] = useState(note || "");

  useEffect(() => {
    setNoteText(note || "");
  }, [note]);

  // Réinitialiser le texte quand le dialog s'ouvre
  useEffect(() => {
    if (isOpen) {
      setNoteText(note || "");
    }
  }, [isOpen, note]);

  const handleSave = () => {
    onSave(noteText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative z-10">
        <h2 className="text-xl font-bold mb-4">Modifier la note</h2>
        <textarea
          className="w-full h-48 p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Ajoutez votre note ici..."
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

NoteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

// Composant pour l'édition du nom d'animal
const NameEditDialog = ({ isOpen, onClose, animalName = "", onSave }) => {
  const [nameText, setNameText] = useState(animalName || "");

  useEffect(() => {
    setNameText(animalName || "");
  }, [animalName]);

  const handleSave = () => {
    onSave(nameText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
        <h2 className="text-xl font-bold mb-4">Modifier le nom</h2>
        <input
          type="text"
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={nameText}
          onChange={(e) => setNameText(e.target.value)}
          placeholder="Nom de l'animal"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

NameEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  animalName: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

// Composant pour la sélection/modification de FA
const FaSelectionDialog = ({ isOpen, onClose, currentFa, onSave }) => {
  const [fas, setFas] = useState([]);
  const [selectedFa, setSelectedFa] = useState(null);
  const [searchText, setSearchText] = useState("");
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    const fetchFas = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/fa/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFas(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des FA:", error);
      }
    };
    fetchFas();
  }, [accessToken]);

  const filteredFas = fas.filter(
    (fa) =>
      compareStringsNoAccent(fa.prenom_fa, searchText) ||
      compareStringsNoAccent(fa.commune_fa, searchText)
  );

  const handleSave = () => {
    onSave(selectedFa);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle className="bg-gray-50 border-b px-6 py-4">
        <div className="text-xl font-medium text-gray-900">
          {currentFa ? "Modifier la Famille d'Accueil" : "Ajouter une Famille d'Accueil"}
        </div>
      </DialogTitle>
      <DialogContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une FA..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredFas.map((fa) => (
              <div
                key={fa.id_fa}
                onClick={() => setSelectedFa(fa)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedFa?.id_fa === fa.id_fa
                    ? "bg-purple-100 border-purple-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-gray-900">{fa.prenom_fa}</div>
                <div className="text-sm text-gray-500">{fa.commune_fa}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors ml-2"
          onClick={handleSave}
          disabled={!selectedFa}
        >
          {currentFa ? "Modifier" : "Ajouter"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

FaSelectionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentFa: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

// Composant pour les champs de date avec calendrier
const DatePickerCell = ({ params, onDateChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [inputValue, setInputValue] = useState(params.value || "");
  const [tempDate, setTempDate] = useState(null);

  // Fonction pour convertir JJ/MM/AAAA en objet dayjs
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }
    return dayjs(dateStr);
  };

  // Fonction pour formater dayjs en JJ/MM/AAAA
  const formatDate = (date) => {
    if (!date || !date.isValid()) return "";
    return date.format('DD/MM/YYYY');
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Supprimer tous les caractères non numériques
    const numericOnly = value.replace(/[^0-9]/g, '');
    
    // Formatter automatiquement avec les slashes
    let formattedValue = '';
    if (numericOnly.length > 0) {
      // Jour (2 chiffres max)
      formattedValue = numericOnly.substring(0, 2);
      
      if (numericOnly.length >= 3) {
        // Ajouter le slash après le jour
        formattedValue += '/' + numericOnly.substring(2, 4);
        
        if (numericOnly.length >= 5) {
          // Ajouter le slash après le mois
          formattedValue += '/' + numericOnly.substring(4, 8);
        }
      }
    }
    
    // Limiter à 10 caractères maximum (JJ/MM/AAAA)
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.substring(0, 10);
    }
    
    setInputValue(formattedValue);
    onDateChange(formattedValue);
  };

  const handleKeyPress = (e) => {
    // Autoriser uniquement les chiffres 0-9, le caractère "/" et les touches de contrôle
    const allowedChars = /[0-9\/]/;
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    
    if (!allowedChars.test(e.key) && !controlKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  // Cette fonction ne ferme plus automatiquement la popup
  const handleDatePickerChange = (newDate) => {
    setTempDate(newDate);
  };

  // Fonction pour accepter la date sélectionnée
  const handleAccept = () => {
    if (tempDate && tempDate.isValid()) {
      const formattedDate = formatDate(tempDate);
      setInputValue(formattedDate);
      onDateChange(formattedDate);
    }
    setIsPickerOpen(false);
    setTempDate(null);
  };

  // Fonction pour annuler la sélection
  const handleCancel = () => {
    setIsPickerOpen(false);
    setTempDate(null);
  };

  // Initialiser tempDate quand on ouvre le calendrier
  const handleOpenCalendar = () => {
    setTempDate(parseDate(inputValue));
    setIsPickerOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="JJ/MM/AAAA"
          inputMode="numeric"
          pattern="[0-9/]*"
          style={{
            width: 'calc(100% - 32px)',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: '8px',
            fontSize: '0.875rem'
          }}
        />
        <IconButton
          size="small"
          onClick={handleOpenCalendar}
          style={{ 
            width: '32px',
            height: '32px',
            padding: '4px'
          }}
        >
          <CalendarTodayIcon style={{ fontSize: '16px' }} />
        </IconButton>
        
        {/* Dialog centré pour le calendrier */}
        <Dialog
          open={isPickerOpen}
          onClose={handleCancel}
          maxWidth="xs"
          fullWidth={false}
          PaperProps={{
            style: {
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              minWidth: '320px'
            },
          }}
        >
          <DialogContent style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StaticDatePicker
              value={tempDate}
              onChange={handleDatePickerChange}
              displayStaticWrapperAs="desktop"
              slotProps={{
                actionBar: {
                  actions: [],
                },
                layout: {
                  sx: {
                    '& .MuiDateCalendar-root': {
                      width: '100%',
                      maxWidth: '320px',
                    }
                  }
                }
              }}
            />
          </DialogContent>
          <DialogActions style={{ padding: '16px', justifyContent: 'space-between' }}>
            <Button 
              onClick={handleCancel}
              variant="outlined"
              color="secondary"
              style={{ minWidth: '80px' }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAccept}
              variant="contained"
              color="primary"
              style={{ minWidth: '80px' }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

DatePickerCell.propTypes = {
  params: PropTypes.object.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

//DataGrid
const AnimalTable = ({
  animals,
  onRowUpdate,
  setAnimals,
  setFilteredAnimals,
  globalSearchText,
  setGlobalSearchText,
}) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const location = useLocation();
  const [searchText, setSearchText] = useState(globalSearchText);
  const [faDialogOpen, setFaDialogOpen] = useState(false);
  const [selectedFa, setSelectedFa] = useState(null);
  const [statuts, setStatuts] = useState([]);
  const [provenances, setProvenances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sexes, setSexes] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: null, note: "" });
  const [faSelectionDialogOpen, setFaSelectionDialogOpen] = useState(false);
  const [selectedAnimalForFa, setSelectedAnimalForFa] = useState(null);
  const [isNameEditDialogOpen, setIsNameEditDialogOpen] = useState(false);
  const [selectedNameEdit, setSelectedNameEdit] = useState({ id: null, name: "" });
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleSearch = (value) => {
    setSearchText(value);
    setGlobalSearchText(value);
  };

  const filteredRows = animals.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        compareStringsNoAccent(value.toString(), searchText)
    )
  ).map(row => ({
    ...row,
    id: row.id_animal
  }));

  const handleFaClick = async (faId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fa/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const faDataList = await response.json();
        const faData = faDataList.find((fa) => fa.id_fa === faId); // Chercher la FA spécifique
        if (faData) {
          setSelectedFa(faData);
          setFaDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données FA:", error);
    }
  };

  const handleImageDialog = (animal) => {
    setSelectedAnimal({
      id: animal.id_animal, // Assurez-vous d'utiliser id_animal
      nom_animal: animal.nom_animal,
    });
    setImageDialogOpen(true);
  };

  const handleNoteClick = (id, note) => {
    setSelectedNote({
      id,
      note: note || "",
    });
    setIsNoteDialogOpen(true);
  };

  const handleNameClick = (id, name) => {
    setSelectedNameEdit({
      id,
      name: name || "",
    });
    setIsNameEditDialogOpen(true);
  };

  const handleNameSave = async (newName) => {
    if (!newName.trim()) {
      alert("Le nom ne peut pas être vide");
      return;
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${selectedNameEdit.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ nom_animal: newName }),
        }
      );

      if (response.ok) {
        // Mise à jour des données locales
        setAnimals((prev) =>
          prev.map((row) =>
            row.id_animal === selectedNameEdit.id ? { ...row, nom_animal: newName } : row
          )
        );
        setFilteredAnimals((prev) =>
          prev.map((row) =>
            row.id_animal === selectedNameEdit.id ? { ...row, nom_animal: newName } : row
          )
        );
        setIsNameEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      alert("Erreur lors de la mise à jour du nom");
    }
  };

  const handleNoteSave = async (newNote) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${selectedNote.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ note: newNote }),
        }
      );

      if (response.ok) {
        setAnimals((prev) =>
          prev.map((row) =>
            row.id === selectedNote.id ? { ...row, note: newNote } : row
          )
        );
        setFilteredAnimals((prev) =>
          prev.map((row) =>
            row.id === selectedNote.id ? { ...row, note: newNote } : row
          )
        );
        setIsNoteDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleFaModification = (animal) => {
    setSelectedAnimalForFa(animal);
    setFaSelectionDialogOpen(true);
  };

  const handleFaSave = async (newFa) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${selectedAnimalForFa.id_animal}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ 
            fa: newFa ? newFa.id_fa : null,
            // Ajout des autres champs nécessaires
            nom_animal: selectedAnimalForFa.nom_animal,
            num_identification: selectedAnimalForFa.num_identification,
            date_naissance: selectedAnimalForFa.date_naissance ? 
              selectedAnimalForFa.date_naissance.split('/').reverse().join('-') : 
              selectedAnimalForFa.date_naissance,
            sterilise: selectedAnimalForFa.sterilise,
            biberonnage: selectedAnimalForFa.biberonnage,
            note: selectedAnimalForFa.note
          }),
        }
              );
        
        if (response.ok) {
          const updatedAnimal = await response.json();

        // Ajouter l'id pour MUI DataGrid et s'assurer que tous les champs sont présents
        const animalWithId = {
          ...selectedAnimalForFa, // Garder les champs existants
          ...updatedAnimal, // Mettre à jour avec les nouvelles données
          id: updatedAnimal.id_animal,
          fa: newFa, // Mettre à jour la FA
          fa_libelle: newFa ? newFa.prenom_fa : null
        };

        setAnimals((prev) => {
          const updated = prev.map((row) =>
            row.id_animal === selectedAnimalForFa.id_animal ? animalWithId : row
          );
          return updated;
        });

        setFilteredAnimals((prev) => {
          const updated = prev.map((row) =>
            row.id_animal === selectedAnimalForFa.id_animal ? animalWithId : row
          );
          return updated;
        });

        setFaSelectionDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la FA:", error);
    }
  };

  useEffect(() => {
    const fetchStatuts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/statut/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setStatuts(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statuts:", error);
      }
    };

    const fetchProvenances = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/provenance/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProvenances(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des provenances:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/categorie/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    const fetchSexes = async () => {
      try {
        const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/sexe/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSexes(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des sexes:", error);
    }
  };

    fetchStatuts();
    fetchProvenances();
    fetchCategories();
    fetchSexes();
  }, [accessToken]);

  // Fonction utilitaire pour formater les dates
  const formatDateToDisplay = (dateStr) => {
    if (!dateStr) return "";
    // Si la date est déjà au format JJ/MM/AAAA
    if (dateStr.includes('/')) return dateStr;
    
    // Convertir YYYY-MM-DD en JJ/MM/AAAA
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  // Fonction utilitaire pour parser les dates JJ/MM/AAAA en objets Date pour le tri
  const parseDateForSorting = (dateStr) => {
    if (!dateStr) return null;
    
    // Si c'est au format JJ/MM/AAAA
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Si c'est au format YYYY-MM-DD
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Fonction de comparaison personnalisée pour les dates
  const dateComparator = (v1, v2) => {
    const date1 = parseDateForSorting(v1);
    const date2 = parseDateForSorting(v2);
    
    // Gérer les valeurs nulles/vides
    if (!date1 && !date2) return 0;
    if (!date1) return -1;
    if (!date2) return 1;
    
    return date1.getTime() - date2.getTime();
  };

  // Configuration des colonnes avec des noms adaptés pour mobile
  const getHeaderName = (longName, shortName) => {
    return isSmallScreen ? shortName : longName;
  };

  const columns = [
    {
      field: "nom_animal",
      headerName: getHeaderName("Nom", "Nom"),
      flex: 3,
      minWidth: 200,
      editable: false,
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-between px-3">
          <div className="flex-1 overflow-hidden mr-2">
            <p 
              className="truncate cursor-pointer text-gray-900 font-medium" 
              title={params.value}
              onClick={() => handleImageDialog(params.row)}
            >
              {params.value}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button 
              type="button"
              onClick={() => handleImageDialog(params.row)} 
              className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
            >
              <ImageIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNameClick(params.row.id, params.value);
              }}
              className="w-6 h-6 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="#3b82f6"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      ),
    },
    {
      field: "fa_libelle",
      headerName: getHeaderName("FA", "FA"),
      flex: 1.2,
      minWidth: isSmallScreen ? 100 : 150,
      renderCell: (params) => (
        <div className="flex items-center justify-between w-full gap-1 px-2 py-1">
          <div
            onClick={() => params.row.fa && handleFaClick(params.row.fa.id_fa)}
            className={`cursor-pointer truncate ${
              params.value ? "text-purple-600 hover:text-purple-800 font-medium" : "text-gray-500 italic"
            }`}
          >
            {params.value || "Non assigné"}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFaModification(params.row);
            }}
            className="p-1 rounded-full hover:bg-purple-100 transition-colors duration-150"
          >
            <span className="sr-only">Modifier la FA</span>
            <svg
              className="w-4 h-4 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      ),
    },
    {
      field: "date_arrivee",
      headerName: getHeaderName("Arrivée", "Arr."),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 100,
      editable: true,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "date_naissance",
      headerName: getHeaderName("Naiss.", "Naiss."),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 100,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "num_identification",
      headerName: getHeaderName("ID#", "ID"),
      flex: isSmallScreen ? 0.7 : 0.8,
      minWidth: isSmallScreen ? 80 : 100,
      renderCell: (params) => (
        <div className="w-full overflow-hidden">
          <div className="truncate text-sm" title={params.value || ""}>
            {params.value}
          </div>
        </div>
      ),
      renderEditCell: (params) => (
        <input
          type="text"
          value={params.value || ""}
          onChange={(e) => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })}
          placeholder="Numéro ID"
          inputMode="numeric"
          pattern="[0-9]*"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            padding: '8px',
            fontSize: '0.875rem'
          }}
        />
      ),
    },
    {
      field: "primo_vacc",
      headerName: getHeaderName("Vacc1", "Vacc1"),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 100,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "rappel_vacc",
      headerName: getHeaderName("RP", "RP"),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 100,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "vermifuge",
      headerName: getHeaderName("Verm.", "Verm."),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 90,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "antipuce",
      headerName: getHeaderName("A-P", "A-P"),
      flex: isSmallScreen ? 0.7 : 0.8,
      minWidth: isSmallScreen ? 80 : 90,
      sortComparator: dateComparator,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return formatDateToDisplay(params.value);
      },
      renderEditCell: (params) => (
        <DatePickerCell
          params={params}
          onDateChange={(value) => params.api.setEditCellValue({ id: params.id, field: params.field, value })}
        />
      ),
    },
    {
      field: "sterilise",
      headerName: getHeaderName("Stér.", "Stér."),
      flex: 0.7,
      minWidth: 80,
      type: "boolean",
    },
    {
      field: "biberonnage",
      headerName: getHeaderName("Bib.", "Bib."),
      flex: 0.7,
      minWidth: 80,
      type: "boolean",
    },
    {
      field: "statut_libelle",
      headerName: getHeaderName("Statut", "Stat."),
      flex: isSmallScreen ? 0.8 : 0.8,
      minWidth: isSmallScreen ? 90 : 90,
      renderCell: (params) => (
        <Select
          value={params.row.statut?.libelle_statut || params.value || ""}
          size="small"
          sx={{
            fontSize: "0.875rem",
            height: "28px",
            width: "100%",
            backgroundColor: "white",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              textAlign: "left",
              paddingRight: "8px !important",
              minHeight: "unset !important",
              lineHeight: "20px",
            },
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "& .MuiSelect-icon": {
              display: "none",
            },
          }}
          onChange={(e) => {
            const selectedStatut = statuts.find(
              (s) => s.libelle_statut === e.target.value
            );
            const updatedRow = {
              ...params.row,
              statut: selectedStatut,
              statut_libelle: selectedStatut.libelle_statut,
            };
            params.api.updateRows([updatedRow]);
            onRowUpdate(updatedRow, params.row);
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Sélectionner un statut
          </MenuItem>
          {/* Catégorie Arrivée */}
          <ListSubheader
            sx={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#1f2937",
              backgroundColor: "#f3f4f6",
              lineHeight: "32px",
            }}
          >
            Arrivée
          </ListSubheader>
          {statuts
            .filter(statut => {
              const libelle = statut.libelle_statut.toLowerCase();
              const sortieStatuts = ["adopté", "chat libre", "mort naturelle", "mort euthanasie", "transfert refuge", "autres"];
              return !sortieStatuts.includes(libelle);
            })
            .map((statut) => (
              <MenuItem
                key={statut.id_statut}
                value={statut.libelle_statut}
                sx={{
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#e5e7eb",
                    fontWeight: "600",
                  },
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                {statut.libelle_statut}
              </MenuItem>
            ))}
          {/* Catégorie Sortie */}
          <ListSubheader
            sx={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#1f2937",
              backgroundColor: "#f3f4f6",
              lineHeight: "32px",
              marginTop: "8px",
            }}
          >
            Sortie
          </ListSubheader>
          {statuts
            .filter(statut => ["adopté", "chat libre", "mort naturelle", "mort euthanasie", "transfert refuge", "autres"]
              .includes(statut.libelle_statut.toLowerCase()))
            .map((statut) => (
              <MenuItem
                key={statut.id_statut}
                value={statut.libelle_statut}
                sx={{
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#e5e7eb",
                    fontWeight: "600",
                  },
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                {statut.libelle_statut}
              </MenuItem>
            ))}
        </Select>
      ),
    },
    {
      field: "provenance_libelle",
      headerName: getHeaderName("Prov.", "Prov."),
      flex: isSmallScreen ? 0.6 : 0.8,
      minWidth: isSmallScreen ? 60 : 90,
      renderCell: (params) => (
        <Select
          value={params.row.provenance?.libelle_provenance || params.value || ""}
          size="small"
          sx={{
            fontSize: "0.875rem",
            height: "28px",
            width: "100%",
            backgroundColor: "white",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              textAlign: "left",
              paddingRight: "8px !important",
              minHeight: "unset !important",
              lineHeight: "20px",
            },
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "& .MuiSelect-icon": {
              display: "none",
            },
          }}
          onChange={(e) => {
            const selectedProvenance = provenances.find(
              (p) => p.libelle_provenance === e.target.value
            );
            const updatedRow = {
              ...params.row,
              provenance: {
                id_provenance: selectedProvenance.id_provenance,
                libelle_provenance: selectedProvenance.libelle_provenance
              },
              provenance_libelle: selectedProvenance.libelle_provenance,
            };
            params.api.updateRows([updatedRow]);
            onRowUpdate(updatedRow, params.row);
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Sélectionner une provenance
          </MenuItem>
          {provenances.map((provenance) => (
            <MenuItem
              key={provenance.id_provenance}
              value={provenance.libelle_provenance}
              sx={{
                fontSize: "0.875rem",
                "&.Mui-selected": {
                  backgroundColor: "#e5e7eb",
                  fontWeight: "600",
                },
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              {provenance.libelle_provenance}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "categorie_libelle",
      headerName: getHeaderName("Cat.", "Cat."),
      flex: isSmallScreen ? 0.5 : 0.7,
      minWidth: isSmallScreen ? 50 : 80,
      renderCell: (params) => (
        <Select
          value={params.row.categorie?.libelle_categorie || params.value || ""}
          size="small"
          sx={{
            fontSize: "0.875rem",
            height: "28px",
            width: "100%",
            backgroundColor: "white",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              textAlign: "left",
              paddingRight: "8px !important",
              minHeight: "unset !important",
              lineHeight: "20px",
            },
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "& .MuiSelect-icon": {
              display: "none",
            },
          }}
          onChange={(e) => {
            const selectedCategorie = categories.find(
              (c) => c.libelle_categorie === e.target.value
            );
            const updatedRow = {
              ...params.row,
              categorie: {
                id_categorie: selectedCategorie.id_categorie,
                libelle_categorie: selectedCategorie.libelle_categorie
              },
              categorie_libelle: selectedCategorie.libelle_categorie,
            };
            params.api.updateRows([updatedRow]);
            onRowUpdate(updatedRow, params.row);
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Sélectionner une catégorie
          </MenuItem>
          {categories.map((categorie) => (
            <MenuItem
              key={categorie.id_categorie}
              value={categorie.libelle_categorie}
              sx={{
                fontSize: "0.875rem",
                "&.Mui-selected": {
                  backgroundColor: "#e5e7eb",
                  fontWeight: "600",
                },
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              {categorie.libelle_categorie}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "sexe_libelle",
      headerName: getHeaderName("Sexe", "Sex"),
      flex: isSmallScreen ? 0.4 : 0.6,
      minWidth: isSmallScreen ? 50 : 70,
      renderCell: (params) => (
        <Select
          value={params.row.sexe?.libelle_sexe || params.value || ""}
          size="small"
          sx={{
            fontSize: "0.875rem",
            height: "28px",
            width: "100%",
            backgroundColor: "white",
            "& .MuiSelect-select": {
              padding: "4px 8px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              textAlign: "left",
              paddingRight: "8px !important",
              minHeight: "unset !important",
              lineHeight: "20px",
            },
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
            "& .MuiSelect-icon": {
              display: "none",
            },
          }}
          onChange={(e) => {
            const selectedSexe = sexes.find(
              (s) => s.libelle_sexe === e.target.value
            );
            const updatedRow = {
              ...params.row,
              sexe: {
                id_sexe: selectedSexe.id_sexe,
                libelle_sexe: selectedSexe.libelle_sexe
              },
              sexe_libelle: selectedSexe.libelle_sexe,
            };
            params.api.updateRows([updatedRow]);
            onRowUpdate(updatedRow, params.row);
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Sélectionner un sexe
          </MenuItem>
          {sexes.map((sexe) => (
            <MenuItem
              key={sexe.id_sexe}
              value={sexe.libelle_sexe}
              sx={{
                fontSize: "0.875rem",
                "&.Mui-selected": {
                  backgroundColor: "#e5e7eb",
                  fontWeight: "600",
                },
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              {sexe.libelle_sexe}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "note",
      headerName: getHeaderName("Notes", "Note"),
      flex: isSmallScreen ? 0.7 : 0.4,
      minWidth: isSmallScreen ? 90 : 80,
      editable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => handleNoteClick(params.row.id, params.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
              ${
                params.value
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
              }`}
            title={params.value ? "Modifier la note" : "Ajouter une note"}
          >
            {params.value ? "Modifier" : "Ajouter"}
          </button>
        </div>
      ),
    },
  ].map((column) => ({
    ...column,
    editable: column.editable !== undefined ? column.editable : (
      column.field !== "fa_libelle" &&
      column.field !== "statut_libelle" &&
      column.field !== "provenance_libelle" &&
      column.field !== "categorie_libelle" &&
      column.field !== "sexe_libelle"
    ),
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    align: "center",
  }));

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const changedFields = {};
      Object.keys(newRow).forEach((key) => {
        // Détecter si la valeur a changé ou si c'est une nouvelle date
        const hasChanged = newRow[key] !== oldRow[key];
        const isEmptyDateField = (oldRow[key] === null || oldRow[key] === "") && 
                                newRow[key] && 
                                ['date_naissance', 'date_arrivee', 'primo_vacc', 
                                 'rappel_vacc', 'vermifuge', 'antipuce'].includes(key);
      
        if (hasChanged || isEmptyDateField) {
          // Pour les champs de date
          if (['date_naissance', 'date_arrivee', 'primo_vacc', 
               'rappel_vacc', 'vermifuge', 'antipuce'].includes(key)) {
            if (newRow[key]) {
              // Valider le format de date JJ/MM/AAAA
              const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
              const match = newRow[key].match(datePattern);
              if (match) {
                const [, day, month, year] = match;
                // Vérifier si la date est valide
                const dayNum = parseInt(day, 10);
                const monthNum = parseInt(month, 10);
                const yearNum = parseInt(year, 10);
                
                if (monthNum < 1 || monthNum > 12) {
                  throw new Error(`Mois invalide dans la date: ${newRow[key]}`);
                }
                
                // Obtenir le dernier jour du mois
                const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate();
                if (dayNum < 1 || dayNum > lastDayOfMonth) {
                  throw new Error(`Jour invalide pour le mois ${monthNum}: ${newRow[key]}`);
                }
      
                // Formater la date pour l'API (YYYY-MM-DD)
                changedFields[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              } else {
                throw new Error(`Format de date invalide pour ${key}. Utilisez JJ/MM/AAAA`);
              }
            } else {
              changedFields[key] = null;
            }
          } else {
            changedFields[key] = newRow[key];
          }
        }
      });
  
      // Si aucun changement n'a été détecté, retourner l'ancienne ligne
      if (Object.keys(changedFields).length === 0) {
        return oldRow;
      }
  
      // Vérifier si le statut change pour "refuge"
      if (newRow.statut?.libelle_statut.toLowerCase() === "refuge") {
        // Supprimer immédiatement la ligne des deux états
        setAnimals((prev) => prev.filter((animal) => animal.id !== newRow.id));
        setFilteredAnimals((prev) =>
          prev.filter((animal) => animal.id !== newRow.id)
        );
  
        // Envoyer la mise à jour au serveur
        changedFields.statut = newRow.statut.id_statut;
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/${newRow.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(changedFields),
          }
        );
  
        return null; // Retourner null pour indiquer la suppression
      }
  
      if (newRow.statut?.id_statut !== oldRow.statut?.id_statut) {
        changedFields.statut = newRow.statut.id_statut;
      }

      // Ajouter les champs modifiés pour provenance, categorie et sexe
      if (newRow.provenance?.id_provenance !== oldRow.provenance?.id_provenance) {
        changedFields.provenance = newRow.provenance.id_provenance;
      }

      if (newRow.categorie?.id_categorie !== oldRow.categorie?.id_categorie) {
        changedFields.categorie = newRow.categorie.id_categorie;
      }

      if (newRow.sexe?.id_sexe !== oldRow.sexe?.id_sexe) {
        changedFields.sexe = newRow.sexe.id_sexe;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
  
        // Si l'animal a été supprimé (adopté)
        if (data.message && data.message.includes("archivé")) {
          // Mettre à jour immédiatement les deux états
          setAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          setFilteredAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          return null;
        }
  
        // Fonction pour formater les dates YYYY-MM-DD en DD/MM/YYYY
        const formatServerDateToDisplay = (dateStr) => {
          if (!dateStr) return dateStr;
          // Si c'est déjà au format DD/MM/YYYY, ne pas toucher
          if (dateStr.includes('/')) return dateStr;
          // Convertir YYYY-MM-DD en DD/MM/YYYY
          const parts = dateStr.split('T')[0].split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
          }
          return dateStr;
        };

        // Pour les autres mises à jour
        const updatedRow = {
          ...newRow,
          ...data,
          id: newRow.id,
          statut: data.statut || newRow.statut,
          statut_libelle: data.statut?.libelle_statut || newRow.statut_libelle,
          // Formater les dates pour l'affichage
          date_arrivee: formatServerDateToDisplay(data.date_arrivee || newRow.date_arrivee),
          date_naissance: formatServerDateToDisplay(data.date_naissance || newRow.date_naissance),
          primo_vacc: formatServerDateToDisplay(data.primo_vacc || newRow.primo_vacc),
          rappel_vacc: formatServerDateToDisplay(data.rappel_vacc || newRow.rappel_vacc),
          vermifuge: formatServerDateToDisplay(data.vermifuge || newRow.vermifuge),
          antipuce: formatServerDateToDisplay(data.antipuce || newRow.antipuce),
        };
  
        // Mettre à jour les deux états
        setAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
        setFilteredAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
  
        return updatedRow;
      }
      throw new Error("Échec de la mise à jour");
    } catch (error) {
      alert(error.message);
      return oldRow;
    }
  };

  useEffect(() => {
    setSearchText(globalSearchText);
  }, [globalSearchText]);

  return (
    <div>
      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        note={selectedNote.note}
        onSave={handleNoteSave}
      />
      <NameEditDialog
        isOpen={isNameEditDialogOpen}
        onClose={() => setIsNameEditDialogOpen(false)}
        animalName={selectedNameEdit.name}
        onSave={handleNameSave}
      />
      <div className="flex mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher..."
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
        />
      </div>
      <div
        style={{ height: 600, width: "100%" }}
        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: isSmallScreen ? 10 : 15 } },
            columns: { columnVisibilityModel: {} },
          }}
          pageSizeOptions={isSmallScreen ? [5, 10, 15] : [15, 30, 50]}
          disableSelectionOnClick
          disableColumnMenu
          disableAutoSize
          rowHeight={44}
          density="compact"
          processRowUpdate={onRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          isCellEditable={(params) => params.field !== "nom_animal"}
          onCellClick={(params) => {
            // Empêcher l'édition par double-clic sur le nom
            if (params.field === "nom_animal") {
              params.api.setCellMode(params.id, params.field, 'view');
            }
          }}
          onCellDoubleClick={(params) => {
            // Empêcher l'édition par double-clic sur le nom
            if (params.field === "nom_animal") {
              params.api.setCellMode(params.id, params.field, 'view');
              return false;
            }
          }}
          components={{
            NoRowsOverlay: () => (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Aucun animal trouvé</p>
              </div>
            ),
          }}
          getCellClassName={(params) => 
            params.field === "nom_animal" ? "nom-animal-cell" : ""
          }
          getRowHeight={() => 'auto'}
          sx={{
            transform: isSmallScreen ? "scale(1)" : "scale(0.9)",
            transformOrigin: "top left",
            width: isSmallScreen ? "100%" : "111%",
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            "& .nom-animal-cell": {
              cursor: "default",
              padding: "0 !important",
              height: "44px !important",
              display: "flex",
              alignItems: "center",
              userSelect: "none",
              "&.MuiDataGrid-cell--editing": {
                pointerEvents: "none !important",
              },
              "&:focus": {
                outline: "none !important",
              },
              "& .MuiInputBase-root": {
                display: "none !important",
              }
            },
            "& .MuiDataGrid-cell": {
              fontSize: isSmallScreen ? "0.8rem" : "0.85rem",
              padding: isSmallScreen ? "8px 6px" : "8px 10px",
              borderRight: "1px solid #cbd5e1",
              borderBottom: "1px solid #cbd5e1",
              borderLeft: "none",
              lineHeight: "1.5",
              whiteSpace: "normal",
              overflow: "visible",
              height: "auto !important",
              maxHeight: "none !important",
            },
            "& .super-app-theme--header": {
              backgroundColor: "#f1f5f9",
              fontSize: isSmallScreen ? "0.75rem" : "0.75rem",
              fontWeight: "700",
              color: "#1e293b",
              borderRight: "1px solid #cbd5e1",
              borderBottom: "2px solid #94a3b8",
              borderLeft: "1px solid #cbd5e1",
              borderTop: "1px solid #cbd5e1",
              textTransform: "uppercase",
              letterSpacing: isSmallScreen ? "0.01em" : "0.025em",
              padding: isSmallScreen ? "8px 6px" : "10px 8px",
              textShadow: "0 0 1px rgba(15, 23, 42, 0.1)",
              whiteSpace: isSmallScreen ? "normal" : "nowrap",
              overflow: "visible",
              textOverflow: "clip",
              "&:hover": {
                backgroundColor: "#e2e8f0",
                color: "#0f172a",
              },
              transition: "all 0.2s ease-in-out",
            },
            "& .MuiDataGrid-row": {
              maxHeight: "none !important", // Pas de hauteur maximale pour les lignes
              height: "auto !important", // Hauteur automatique pour les lignes
              "&:nth-of-type(even)": {
                backgroundColor: "#ffffff",
              },
              "&:nth-of-type(odd)": {
                backgroundColor: "#f1f5f9",
              },
              "&:hover": {
                backgroundColor: "#e0f2fe !important",
                cursor: "pointer",
                transition: "background-color 0.15s ease-in-out",
              },
              transition: "background-color 0.15s ease-in-out",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #94a3b8",
              backgroundColor: "#f1f5f9",
              borderTop: "1px solid #e2e8f0",
              borderLeft: "1px solid #e2e8f0",
              borderRight: "1px solid #e2e8f0",
            },
            "& .MuiDataGrid-columnHeader": {
              padding: isSmallScreen ? "0 6px" : "0 16px", 
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              overflow: "visible",
              lineHeight: isSmallScreen ? "1.3" : "1.3",
              whiteSpace: isSmallScreen ? "normal" : "normal",
              textOverflow: "clip",
              fontSize: isSmallScreen ? "0.70rem" : "0.75rem"
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              padding: "8px 0",
              borderLeft: "1px solid #e2e8f0",
              borderRight: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            },
            "& .MuiTablePagination-root": {
              fontSize: isSmallScreen ? "0.75rem" : "0.8rem",
              color: "#475569",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: isSmallScreen ? "0.75rem" : "0.8rem",
              color: "#475569",
              margin: 0,
              display: isSmallScreen ? "block" : "block",
              padding: isSmallScreen ? "0 4px" : "0",
            },
            "& .MuiCheckbox-root": {
              color: "#64748b",
              padding: "4px",
            },
            "& .MuiButtonBase-root.MuiIconButton-root": {
              color: "#64748b",
              "&:hover": {
                backgroundColor: "#e2e8f0",
                color: "#0f172a",
              },
              "&.Mui-disabled": {
                color: "#cbd5e1",
              },
            },
          }}
        />
      </div>
      <FaDialog
        open={faDialogOpen}
        onClose={() => setFaDialogOpen(false)}
        faData={selectedFa}
      />
      <ImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        animalId={selectedAnimal?.id}
        animalName={selectedAnimal?.nom_animal}
      />
      <FaSelectionDialog
        isOpen={faSelectionDialogOpen}
        onClose={() => setFaSelectionDialogOpen(false)}
        currentFa={selectedAnimalForFa?.fa}
        onSave={handleFaSave}
      />
    </div>
  );
};

AnimalTable.propTypes = {
  animals: PropTypes.array.isRequired,
  onRowUpdate: PropTypes.func.isRequired,
  setAnimals: PropTypes.func.isRequired,
  setFilteredAnimals: PropTypes.func.isRequired,
  globalSearchText: PropTypes.string.isRequired,
  setGlobalSearchText: PropTypes.func.isRequired,
};

function Refuge() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [globalSearchText, setGlobalSearchText] = useState(localStorage.getItem('refugeSearchValue') || '');
  const [zoomLevel, setZoomLevel] = useState(1);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const location = useLocation();

  const handleGlobalSearch = (value) => {
    setGlobalSearchText(value);
    localStorage.setItem('refugeSearchValue', value);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.1, 1.5);
    setZoomLevel(newZoom);
    document.body.style.zoom = newZoom;
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.1, 0.7);
    setZoomLevel(newZoom);
    document.body.style.zoom = newZoom;
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    document.body.style.zoom = 1;
  };

  // Initialiser et nettoyer le zoom
  useEffect(() => {
    // Initialiser le zoom au montage du composant
    document.body.style.zoom = zoomLevel;
    
    // Nettoyer le zoom au démontage du composant
    return () => {
      document.body.style.zoom = 1;
    };
  }, []);

  // Vérifier si localStorage a été effacé lors du rechargement de la page
  useEffect(() => {
    const storedValue = localStorage.getItem('refugeSearchValue') || '';
    if (globalSearchText !== storedValue) {
      setGlobalSearchText(storedValue);
    }
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        if (!accessToken) {
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Fonction pour formater les dates YYYY-MM-DD en DD/MM/YYYY lors du chargement initial
          const formatInitialDateToDisplay = (dateStr) => {
            if (!dateStr) return dateStr;
            // Si c'est déjà au format DD/MM/YYYY, ne pas toucher
            if (dateStr.includes('/')) return dateStr;
            // Convertir YYYY-MM-DD en DD/MM/YYYY
            const parts = dateStr.split('T')[0].split('-');
            if (parts.length === 3) {
              const [year, month, day] = parts;
              return `${day}/${month}/${year}`;
            }
            return dateStr;
          };

          // Filtrer pour exclure les animaux avec statut "refuge"
          const nonRefugeAnimals = data
            .filter(
              (animal) =>
                animal.statut?.libelle_statut.toLowerCase() !== "refuge"
            )
            .map((animal) => ({
              ...animal,
              id: animal.id_animal,
              statut_libelle: animal.statut?.libelle_statut || "",
              statut: {
                id_statut: animal.statut?.id_statut,
                libelle_statut: animal.statut?.libelle_statut,
              },
              provenance_libelle: animal.provenance?.libelle_provenance || "",
              categorie_libelle: animal.categorie?.libelle_categorie || "",
              sexe_libelle: animal.sexe?.libelle_sexe || "",
              fa_libelle: animal.fa?.prenom_fa || "",
              id_fa: animal.fa?.id_fa || null,
              // Formater toutes les dates pour l'affichage initial
              date_arrivee: formatInitialDateToDisplay(animal.date_arrivee),
              date_naissance: formatInitialDateToDisplay(animal.date_naissance),
              primo_vacc: formatInitialDateToDisplay(animal.primo_vacc),
              rappel_vacc: formatInitialDateToDisplay(animal.rappel_vacc),
              vermifuge: formatInitialDateToDisplay(animal.vermifuge),
              antipuce: formatInitialDateToDisplay(animal.antipuce),
            }));

          setAnimals(nonRefugeAnimals);
          setFilteredAnimals(nonRefugeAnimals);
        } else {
          throw new Error(`Réponse non OK: ${response.status}`);
        }
      } catch (error) {
        // Erreur silencieuse
      }
    };

    fetchAnimals();
  }, [accessToken]);

  const isMainPage = location.pathname === "/refuge";

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const changedFields = {};
      Object.keys(newRow).forEach((key) => {
        // Détecter si la valeur a changé ou si c'est une nouvelle date
        const hasChanged = newRow[key] !== oldRow[key];
        const isEmptyDateField = (oldRow[key] === null || oldRow[key] === "") && 
                                newRow[key] && 
                                ['date_naissance', 'date_arrivee', 'primo_vacc', 
                                 'rappel_vacc', 'vermifuge', 'antipuce'].includes(key);
      
        if (hasChanged || isEmptyDateField) {
          // Pour les champs de date
          if (['date_naissance', 'date_arrivee', 'primo_vacc', 
               'rappel_vacc', 'vermifuge', 'antipuce'].includes(key)) {
            if (newRow[key]) {
              // Valider le format de date JJ/MM/AAAA
              const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
              const match = newRow[key].match(datePattern);
              if (match) {
                const [, day, month, year] = match;
                // Vérifier si la date est valide
                const dayNum = parseInt(day, 10);
                const monthNum = parseInt(month, 10);
                const yearNum = parseInt(year, 10);
                
                if (monthNum < 1 || monthNum > 12) {
                  throw new Error(`Mois invalide dans la date: ${newRow[key]}`);
                }
                
                // Obtenir le dernier jour du mois
                const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate();
                if (dayNum < 1 || dayNum > lastDayOfMonth) {
                  throw new Error(`Jour invalide pour le mois ${monthNum}: ${newRow[key]}`);
                }
      
                // Formater la date pour l'API (YYYY-MM-DD)
                changedFields[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              } else {
                throw new Error(`Format de date invalide pour ${key}. Utilisez JJ/MM/AAAA`);
              }
            } else {
              changedFields[key] = null;
            }
          } else {
            changedFields[key] = newRow[key];
          }
        }
      });
  
      // Si aucun changement n'a été détecté, retourner l'ancienne ligne
      if (Object.keys(changedFields).length === 0) {
        return oldRow;
      }
  
      // Vérifier si le statut change pour "refuge"
      if (newRow.statut?.libelle_statut.toLowerCase() === "refuge") {
        // Supprimer immédiatement la ligne des deux états
        setAnimals((prev) => prev.filter((animal) => animal.id !== newRow.id));
        setFilteredAnimals((prev) =>
          prev.filter((animal) => animal.id !== newRow.id)
        );
  
        // Envoyer la mise à jour au serveur
        changedFields.statut = newRow.statut.id_statut;
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/${newRow.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(changedFields),
          }
        );
  
        return null; // Retourner null pour indiquer la suppression
      }
  
      if (newRow.statut?.id_statut !== oldRow.statut?.id_statut) {
        changedFields.statut = newRow.statut.id_statut;
      }

      // Ajouter les champs modifiés pour provenance, categorie et sexe
      if (newRow.provenance?.id_provenance !== oldRow.provenance?.id_provenance) {
        changedFields.provenance = newRow.provenance.id_provenance;
      }

      if (newRow.categorie?.id_categorie !== oldRow.categorie?.id_categorie) {
        changedFields.categorie = newRow.categorie.id_categorie;
      }

      if (newRow.sexe?.id_sexe !== oldRow.sexe?.id_sexe) {
        changedFields.sexe = newRow.sexe.id_sexe;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
  
        // Si l'animal a été supprimé (adopté)
        if (data.message && data.message.includes("archivé")) {
          // Mettre à jour immédiatement les deux états
          setAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          setFilteredAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          return null;
        }
  
        // Fonction pour formater les dates YYYY-MM-DD en DD/MM/YYYY
        const formatServerDateToDisplay = (dateStr) => {
          if (!dateStr) return dateStr;
          // Si c'est déjà au format DD/MM/YYYY, ne pas toucher
          if (dateStr.includes('/')) return dateStr;
          // Convertir YYYY-MM-DD en DD/MM/YYYY
          const parts = dateStr.split('T')[0].split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year}`;
          }
          return dateStr;
        };

        // Pour les autres mises à jour
        const updatedRow = {
          ...newRow,
          ...data,
          id: newRow.id,
          statut: data.statut || newRow.statut,
          statut_libelle: data.statut?.libelle_statut || newRow.statut_libelle,
          // Formater les dates pour l'affichage
          date_arrivee: formatServerDateToDisplay(data.date_arrivee || newRow.date_arrivee),
          date_naissance: formatServerDateToDisplay(data.date_naissance || newRow.date_naissance),
          primo_vacc: formatServerDateToDisplay(data.primo_vacc || newRow.primo_vacc),
          rappel_vacc: formatServerDateToDisplay(data.rappel_vacc || newRow.rappel_vacc),
          vermifuge: formatServerDateToDisplay(data.vermifuge || newRow.vermifuge),
          antipuce: formatServerDateToDisplay(data.antipuce || newRow.antipuce),
        };
  
        // Mettre à jour les deux états
        setAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
        setFilteredAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
  
        return updatedRow;
      }
      throw new Error("Échec de la mise à jour");
    } catch (error) {
      alert(error.message);
      return oldRow;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Animaux en FA</h1>
            <p className="text-sm text-gray-500">
              Gestion des animaux en famille d&apos;accueil
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors duration-150"
                title="Dézoomer"
                disabled={zoomLevel <= 0.7}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-x border-gray-300 transition-colors duration-150"
                title="Zoom normal"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors duration-150"
                title="Zoomer"
                disabled={zoomLevel >= 1.5}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMainPage && (
        <div className="flex-1 min-h-0">
          <AnimalTable
            animals={filteredAnimals}
            onRowUpdate={handleRowUpdate}
            setAnimals={setAnimals}
            setFilteredAnimals={setFilteredAnimals}
            globalSearchText={globalSearchText}
            setGlobalSearchText={handleGlobalSearch}
          />
        </div>
      )}
    </div>
  );
}

export default Refuge;
