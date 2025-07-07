import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ACCESS_TOKEN } from "../constants";
import { FaCaretDown, FaPaw, FaNotesMedical, FaCalendarAlt, FaIdCard, FaSyringe, FaBug, FaVenus, FaMars, FaMapMarkerAlt, FaTag, FaCat, FaClipboardList, FaCalendarDay } from "react-icons/fa";

function FormCreateAnimal({ onClose }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [primoVacc, setPrimoVacc] = useState("");
  const [rappelVacc, setRappelVacc] = useState("");
  const [vermifuge, setVermifuge] = useState("");
  const [antipuce, setAntipuce] = useState("");
  const [sterilise, setSterilise] = useState(false);
  const [biberonnage, setBiberonnage] = useState(false);
  const [note, setNote] = useState("");
  const [statut, setStatut] = useState("");
  const [provenance, setProvenance] = useState("");
  const [categorie, setCategorie] = useState("");
  const [sexe, setSexe] = useState("");
  const [fa, setFa] = useState("");
  const [fas, setFas] = useState([]);
  const [filteredFas, setFilteredFas] = useState([]);
  const [selectedFaId, setSelectedFaId] = useState(null);
  const [showFaList, setShowFaList] = useState(false);
  const faInputRef = useRef(null);
  const [sexes, setSexes] = useState([]);
  const [provenances, setProvenances] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.log("Réponse reçue:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("FA bien lu", data);
          setFas(data);
          setFilteredFas(data);
        } else {
          console.log("Réponse non OK:", response.status, response.statusText);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des FA:", error);
      }
    };

    fetchFas();
  }, []);

  useEffect(() => {
    const fetchSexes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/sexe/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des sexes:", data);
          // Vérifiez si data est un tableau ou un objet avec une propriété contenant le tableau
          const sexesArray = Array.isArray(data) ? data : Object.values(data);
          console.log("Tableau des sexes après traitement:", sexesArray);
          setSexes(sexesArray);
        } else {
          console.error("Erreur réponse API sexes:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sexes:", error);
        setSexes([]);
      }
    };

    const fetchProvenances = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/provenance/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des provenances:", data);
          const provenanceArray = Array.isArray(data)
            ? data
            : Object.values(data);
          console.log(
            "Tableau des provenances après traitement:",
            provenanceArray
          );
          setProvenances(provenanceArray); // Correction: utiliser setProvenances au lieu de setSexes
        } else {
          console.error("Erreur réponse API provenance:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des provenance:", error);
        setProvenances([]);
      }
    };

    const fetchStatuts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/statut/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des statuts:", data);
          const statutArray = Array.isArray(data) ? data : Object.values(data);
          console.log("Tableau des statuts après traitement:", statutArray);
          setStatuts(statutArray);
        } else {
          console.error("Erreur réponse API statut:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statuts:", error);
        setStatuts([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/categorie/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des catégories:", data);
          const categorieArray = Array.isArray(data)
            ? data
            : Object.values(data);
          console.log(
            "Tableau des catégories après traitement:",
            categorieArray
          );
          setCategories(categorieArray);
        } else {
          console.error("Erreur réponse API categorie:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des categories:", error);
        setCategories([]);
      }
    };

    fetchSexes();
    fetchProvenances();
    fetchStatuts();
    fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faInputRef.current && !faInputRef.current.contains(event.target)) {
        setShowFaList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFaChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFa(e.target.value);
    setSelectedFaId(null);
    setShowFaList(true);
    if (searchTerm.length > 0) {
      setFilteredFas(
        fas.filter((fa) => {
          const prenomMatch =
            fa?.prenom_fa?.toLowerCase()?.includes(searchTerm) || false;
          return prenomMatch;
        })
      );
    } else {
      setFilteredFas([]);
    }
  };

  const toggleFaList = () => {
    setShowFaList(true);
    setFa("");
    setSelectedFaId(null);
    setFilteredFas(fas);
  };

  const handleFaClick = (f) => {
    setFa(f?.prenom_fa || "");
    setSelectedFaId(f?.id_fa);
    setShowFaList(false);
    setFilteredFas([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!name) {
      alert("Veuillez remplir le champ du nom.");
      setIsSubmitting(false);
      return;
    }

    const animalData = {
      nom_animal: name,
      date_naissance: formatDate(birthDate),
      num_identification: identificationNumber || null,
      primo_vacc: formatDate(primoVacc),
      rappel_vacc: formatDate(rappelVacc),
      vermifuge: formatDate(vermifuge),
      antipuce: formatDate(antipuce),
      sterilise: sterilise ? 1 : 0,
      biberonnage: biberonnage ? 1 : 0,
      note: note || "",
      statut: statut ? parseInt(statut) : null,
      provenance: provenance ? parseInt(provenance) : null,
      categorie: categorie ? parseInt(categorie) : null,
      sexe: sexe ? parseInt(sexe) : null,
      fa: selectedFaId ? parseInt(selectedFaId) : null,
    };

    console.log("Données envoyées:", animalData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/animal/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(animalData),
        }
      );

      const data = await response.json();
      console.log("Réponse de l'API:", data);

      if (!response.ok) {
        let errorMessage = "Erreur lors de la création de l'animal: ";
        if (typeof data === "object") {
          Object.entries(data).forEach(([key, value]) => {
            errorMessage += `${key}: ${value.join(", ")}; `;
          });
        }
        alert(errorMessage);
        setIsSubmitting(false);
        return;
      }

      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la communication avec le serveur");
      setIsSubmitting(false);
    }
  };

  // Fonction pour faciliter la sélection de date
  const handleDatePickerFocus = (e) => {
    e.target.showPicker();
  };

  // Fonction pour définir une date rapide
  const setQuickDate = (setter, daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    setter(date.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-3">
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-t-lg py-3 px-3 sm:py-2">
        <h2 className="text-base sm:text-lg font-bold text-white text-center flex items-center justify-center">
          <FaPaw className="mr-2 text-sm sm:text-base" /> Nouvel Animal
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3">
          {/* Première colonne */}
          <div className="space-y-2 sm:space-y-3">
            {/* Informations générales */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaIdCard className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Informations générales
                </h3>
              </div>
              <div className="p-2 sm:p-3">
                <div className="space-y-2">
                  <div>
                    <label
                      htmlFor="animalName"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom de l&apos;animal *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaPaw className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="text"
                        id="animalName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nom de l'animal"
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="identificationNumber"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      N° d&apos;identification
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaTag className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="identificationNumber"
                        value={identificationNumber}
                        onChange={(e) => setIdentificationNumber(e.target.value)}
                        placeholder="N° d'identification"
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caractéristiques supplémentaires */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaNotesMedical className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Caractéristiques
                </h3>
              </div>
              <div className="p-2 sm:p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <label className="relative flex items-center py-2 sm:py-1.5 px-2 rounded-md border border-gray-200 bg-white cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sterilise}
                      onChange={(e) => setSterilise(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border border-gray-300 rounded-sm mr-2 flex items-center justify-center peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-colors">
                      <svg 
                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" 
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 peer-checked:text-purple-700">Stérilisé(e)</span>
                  </label>
                  
                  <label className="relative flex items-center py-2 sm:py-1.5 px-2 rounded-md border border-gray-200 bg-white cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={biberonnage}
                      onChange={(e) => setBiberonnage(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border border-gray-300 rounded-sm mr-2 flex items-center justify-center peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-colors">
                      <svg 
                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" 
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 peer-checked:text-purple-700">Biberonnage</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section Sexe et Statut */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaClipboardList className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Statut & Sexe
                </h3>
              </div>
              <div className="p-2 sm:p-3 space-y-2">
                <div>
                  <label
                    htmlFor="sexe"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Sexe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <div className="flex">
                        <FaVenus className="text-pink-400 text-xs sm:text-sm" />
                        <FaMars className="text-blue-400 -ml-1 text-xs sm:text-sm" />
                      </div>
                    </div>
                    <select
                      id="sexe"
                      value={sexe}
                      onChange={(e) => setSexe(e.target.value)}
                      className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="">Sélectionner</option>
                      {sexes && sexes.length > 0 ? (
                        sexes.map((s) => (
                          <option
                            key={`sexe-${s.id_sexe || s.id}`}
                            value={s.id_sexe || s.id}
                          >
                            {s.libelle_sexe || s.libelle || "Sans libellé"}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="statut"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Statut
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaClipboardList className="text-gray-400 text-xs sm:text-sm" />
                    </div>
                    <select
                      id="statut"
                      value={statut}
                      onChange={(e) => setStatut(e.target.value)}
                      className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="">Sélectionner</option>
                      {statuts && statuts.length > 0 ? (
                        statuts.map((s) => (
                          <option
                            key={`statut-${s.id_statut || s.id}`}
                            value={s.id_statut || s.id}
                          >
                            {s.libelle_statut || s.libelle || "Sans libellé"}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="space-y-2 sm:space-y-3">
            {/* Dates importantes */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaCalendarAlt className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Dates importantes
                </h3>
              </div>
              <div className="p-2 sm:p-3 space-y-2">
                {/* Date de naissance */}
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Date de naissance
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="date"
                        id="birthDate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        onClick={handleDatePickerFocus}
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex">
                      <button
                        type="button"
                        className="px-2 sm:px-1.5 py-2 sm:py-1.5 bg-purple-500 text-white text-xs border-r border-purple-600"
                        onClick={() => setQuickDate(setBirthDate, 0)}
                        title="Aujourd'hui"
                      >
                        <FaCalendarDay className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="px-2 sm:px-1.5 py-2 sm:py-1.5 bg-purple-600 text-white text-xs rounded-r-md"
                        onClick={() => setQuickDate(setBirthDate, 30)}
                        title="1 mois"
                      >
                        1m
                      </button>
                    </div>
                  </div>
                </div>

                {/* Premier vaccin */}
                <div>
                  <label
                    htmlFor="primoVaccDate"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Premier vaccin
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaSyringe className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="date"
                        id="primoVaccDate"
                        value={primoVacc}
                        onChange={(e) => setPrimoVacc(e.target.value)}
                        onClick={handleDatePickerFocus}
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-2 sm:px-1.5 py-2 sm:py-1.5 bg-purple-500 text-white text-xs rounded-r-md"
                      onClick={() => setQuickDate(setPrimoVacc, 0)}
                      title="Aujourd'hui"
                    >
                      <FaCalendarDay className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rappel vaccinal */}
                <div>
                  <label
                    htmlFor="rappelVaccDate"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Rappel vaccinal
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaSyringe className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="date"
                        id="rappelVaccDate"
                        value={rappelVacc}
                        onChange={(e) => setRappelVacc(e.target.value)}
                        onClick={handleDatePickerFocus}
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-2 sm:px-1.5 py-2 sm:py-1.5 bg-purple-500 text-white text-xs rounded-r-md"
                      onClick={() => setQuickDate(setRappelVacc, 0)}
                      title="Aujourd'hui"
                    >
                      <FaCalendarDay className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Vermifuge */}
                <div>
                  <label
                    htmlFor="vermifugeDate"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Vermifuge
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaBug className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                      <input
                        type="date"
                        id="vermifugeDate"
                        value={vermifuge}
                        onChange={(e) => setVermifuge(e.target.value)}
                        onClick={handleDatePickerFocus}
                        className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-2 sm:px-1.5 py-2 sm:py-1.5 bg-purple-500 text-white text-xs rounded-r-md"
                      onClick={() => setQuickDate(setVermifuge, 0)}
                      title="Aujourd'hui"
                    >
                      <FaCalendarDay className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Anti-puce */}
                <div>
                  <label
                    htmlFor="antipuceDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Anti-puce
                  </label>
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaBug className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="antipuceDate"
                        value={antipuce}
                        onChange={(e) => setAntipuce(e.target.value)}
                        onClick={handleDatePickerFocus}
                        className="w-full pl-7 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-1.5 py-1.5 bg-purple-500 text-white text-xs rounded-r-md"
                      onClick={() => setQuickDate(setAntipuce, 0)}
                      title="Aujourd'hui"
                    >
                      <FaCalendarDay className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Boutons de validation */}
                <div className="pt-3 sm:pt-4 mt-3 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 sm:py-1.5 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 order-2 sm:order-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center px-4 py-2 sm:py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-md shadow hover:from-purple-700 hover:to-purple-800 order-1 sm:order-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <FaPaw className="mr-2 text-xs sm:text-sm" />
                    {isSubmitting ? 'En cours...' : 'Ajouter l\'animal'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Troisième colonne */}
          <div className="space-y-2 sm:space-y-3">
            {/* Famille d'Accueil */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaMapMarkerAlt className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Famille d'Accueil
                </h3>
              </div>
              <div className="p-2 sm:p-3">
                <div ref={faInputRef} className="relative">
                  <label
                    htmlFor="faInput"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Rechercher une FA
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="faInput"
                      value={fa}
                      onChange={handleFaChange}
                      onFocus={() => setShowFaList(true)}
                      placeholder="Prénom du FA"
                      className="w-full py-2 sm:py-1.5 pl-2 text-xs sm:text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={toggleFaList}
                      className="py-2 sm:py-1.5 px-2 bg-purple-600 text-white text-sm rounded-r-md hover:bg-purple-700"
                    >
                      <FaCaretDown className="text-xs sm:text-sm" />
                    </button>
                  </div>
                  {showFaList && filteredFas.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[120px] sm:max-h-[150px] overflow-y-auto">
                      {filteredFas.map((f) => (
                        <div
                          key={`fa-suggestion-${f?.id_fa}`}
                          className="p-3 sm:p-2 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleFaClick(f)}
                        >
                          <div className="font-medium text-purple-700 text-xs sm:text-sm">
                            {f?.prenom_fa || "Sans prénom"}
                          </div>
                          <div className="text-xs text-gray-600 flex flex-wrap items-center gap-1 mt-1">
                            {f?.commune_fa && (
                              <span className="flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-xs" />
                                {f.commune_fa}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Provenance et Catégorie */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaCat className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Catégorie & Provenance
                </h3>
              </div>
              <div className="p-2 sm:p-3 space-y-2">
                <div>
                  <label
                    htmlFor="provenance"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Provenance
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400 text-xs sm:text-sm" />
                    </div>
                    <select
                      id="provenance"
                      value={provenance}
                      onChange={(e) => setProvenance(e.target.value)}
                      className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="">Sélectionner</option>
                      {provenances && provenances.length > 0 ? (
                        provenances.map((p) => (
                          <option
                            key={`provenance-${p.id_provenance || p.id}`}
                            value={p.id_provenance || p.id}
                          >
                            {p.libelle_provenance || p.libelle || "Sans libellé"}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="categorie"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Catégorie
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaCat className="text-gray-400 text-xs sm:text-sm" />
                    </div>
                    <select
                      id="categorie"
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                      className="w-full pl-6 sm:pl-7 py-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="">Sélectionner</option>
                      {categories && categories.length > 0 ? (
                        categories.map((c) => (
                          <option
                            key={`categorie-${c.id_categorie || c.id}`}
                            value={c.id_categorie || c.id}
                          >
                            {c.libelle_categorie || c.libelle || "Sans libellé"}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Chargement...
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
              <div className="bg-purple-100 px-2 sm:px-3 py-2 sm:py-1.5 border-b border-purple-200">
                <h3 className="text-xs sm:text-sm font-semibold text-purple-800 flex items-center">
                  <FaNotesMedical className="mr-1 sm:mr-2 text-purple-600 text-xs sm:text-sm" /> Notes
                </h3>
              </div>
              <div className="p-2 sm:p-3">
                <label
                  htmlFor="noteTextarea"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Informations complémentaires
                </label>
                <textarea
                  id="noteTextarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Observations, antécédents médicaux..."
                  className="w-full h-20 sm:h-24 py-2 sm:py-1.5 px-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

FormCreateAnimal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FormCreateAnimal;
