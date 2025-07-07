import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ACCESS_TOKEN } from "../constants";

function Stats() {
  const [archiveData, setArchiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [activeTab, setActiveTab] = useState('general'); // Nouvel état pour les onglets

  // Couleurs modernes pour les graphiques
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9E579D', '#574B90'];

  // Fonction utilitaire pour normaliser et comparer les statuts
  const matchStatus = (itemStatus, targetStatus) => {
    if (!itemStatus) return false;
    
    // Normalisation: minuscules, suppression des espaces en début/fin, traitement des accents
    const normalize = (str) => str.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
    
    return normalize(itemStatus) === normalize(targetStatus);
  };

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/archive/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");

        const data = await response.json();
        setArchiveData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  useEffect(() => {
    // Extraire les années disponibles à partir des données
    const years = Array.from(
      new Set(
        archiveData
          .map((item) => {
            const dateStr = item.created_at;
            if (dateStr) {
              const date = new Date(dateStr);
              const year = date.getFullYear();
              return isNaN(year) ? null : year;
            }
            return null;
          })
          .filter((year) => year !== null)
      )
    ).sort((a, b) => b - a);
    setAvailableYears(["Global", ...years]);
  }, [archiveData]);

  // Préparation des données pour le graphique des motifs d'archivage
  const motifData = {
    labels: [
      "Adoption",
      "Mort Naturelle",
      "Mort Euthanasie",
      "Sortie Refuge",
      "Chat Libre",
    ],
    datasets: [
      {
        data: [
          archiveData.filter(
            (item) =>
              matchStatus(item.statut?.libelle_statut, "adopté") &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              matchStatus(item.statut?.libelle_statut, "mort naturelle") &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              matchStatus(item.statut?.libelle_statut, "mort euthanasie") &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              matchStatus(item.statut?.libelle_statut, "transfert refuge") &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              matchStatus(item.statut?.libelle_statut, "chat libre") &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
        ],
        backgroundColor: [
          "#4ade80",
          "#f87171",
          "#fbbf24",
          "#60a5fa",
          "#a78bfa",
        ],
        borderColor: ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#7c3aed"],
        borderWidth: 1,
      },
    ],
  };

  // Ajoutez ces données de préparation pour le graphique des provenances juste après motifData
  const provenanceData = {
    labels: Array.from(
      new Set(
        archiveData
          .filter((item) => item.provenance?.libelle_provenance)
          .map((item) => item.provenance.libelle_provenance)
      )
    ),
    datasets: [
      {
        data: Array.from(
          new Set(
            archiveData
              .filter((item) => item.provenance?.libelle_provenance)
              .map((item) => item.provenance.libelle_provenance)
          )
        ).map(
          (provenance) =>
            archiveData.filter(
              (item) =>
                item.provenance?.libelle_provenance === provenance &&
                (selectedYear === "Global" ||
                  new Date(item.created_at).getFullYear() ===
                    Number(selectedYear))
            ).length
        ),
        backgroundColor: [
          "#f472b6", // rose
          "#fb923c", // orange
          "#a78bfa", // violet
          "#60a5fa", // bleu
          "#4ade80", // vert
          "#facc15", // jaune
          "#94a3b8", // gris
        ],
        borderColor: [
          "#ec4899",
          "#f97316",
          "#7c3aed",
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#64748b",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Ajouter après provenanceData
  const categorieData = {
    labels: Array.from(
      new Set(
        archiveData
          .filter((item) => item.categorie?.libelle_categorie)
          .map((item) => item.categorie.libelle_categorie)
      )
    ),
    datasets: [
      {
        data: Array.from(
          new Set(
            archiveData
              .filter((item) => item.categorie?.libelle_categorie)
              .map((item) => item.categorie.libelle_categorie)
          )
        ).map(
          (categorie) =>
            archiveData.filter(
              (item) =>
                item.categorie?.libelle_categorie === categorie &&
                (selectedYear === "Global" ||
                  new Date(item.created_at).getFullYear() ===
                    Number(selectedYear))
            ).length
        ),
        backgroundColor: [
          "#84cc16", // lime
          "#06b6d4", // cyan
          "#f43f5e", // rose
          "#8b5cf6", // violet
          "#fbbf24", // amber
        ],
        borderColor: ["#65a30d", "#0891b2", "#e11d48", "#7c3aed", "#d97706"],
        borderWidth: 1,
      },
    ],
  };

  const getMonthlyAdoptions = () => {
    if (selectedYear === "Global") {
      // Pour le mode global, on regroupe par année
      const yearlyData = {};
      archiveData
        .filter(item => {
          // Vérification stricte du statut "adopté" avec normalisation
          const isAdopted = matchStatus(item.statut?.libelle_statut, "adopté");
          return isAdopted;
        })
        .forEach(item => {
          const year = new Date(item.created_at).getFullYear();
          yearlyData[year] = (yearlyData[year] || 0) + 1;
        });

      // Convertir en format pour le graphique
      return Object.entries(yearlyData)
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([year, value]) => ({
          name: year.toString(),
          value: value
        }));
    }

    // Pour une année spécifique, on regroupe par mois
    const monthsData = new Array(12).fill(0);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    archiveData
      .filter(
        (item) => {
          // Vérification stricte du statut "adopté" avec normalisation
          const isAdopted = matchStatus(item.statut?.libelle_statut, "adopté");
          const yearMatch = new Date(item.created_at).getFullYear() === Number(selectedYear);
          return isAdopted && yearMatch;
        }
      )
      .forEach((item) => {
        const month = new Date(item.created_at).getMonth();
        monthsData[month]++;
      });

    return monthNames.map((name, index) => ({
      name,
      value: monthsData[index]
    }));
  };

  const getTotalAdoptions = () => {
    // Log pour débogage - voir tous les statuts présents
    if (selectedYear === "Global") {
      console.log("Tous les statuts disponibles:", 
        [...new Set(archiveData.map(item => item.statut?.libelle_statut))]
      );
    }
    
    const adoptedAnimals = selectedYear === "Global"
      ? archiveData.filter(item => {
          // Vérification stricte du statut "adopté" avec normalisation
          const isAdopted = matchStatus(item.statut?.libelle_statut, "adopté");
          
          // Log pour débogage
          if (isAdopted) {
            console.log("Animal adopté:", item.nom_animal, "Statut:", item.statut?.libelle_statut);
          }
          
          return isAdopted;
        })
      : archiveData.filter(item => {
          // Vérification stricte du statut "adopté" et de l'année
          const isAdopted = matchStatus(item.statut?.libelle_statut, "adopté");
          const yearMatch = new Date(item.created_at).getFullYear() === Number(selectedYear);
          
          return isAdopted && yearMatch;
        });
    
    return adoptedAnimals.length;
  };

  const getStatusData = () => {
    // Créer un objet pour stocker le compte de chaque statut
    const statusCount = {};
    
    // Filtrer les données selon l'année sélectionnée
    const filteredData = selectedYear === "Global"
      ? archiveData
      : archiveData.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getFullYear().toString() === selectedYear.toString();
        });

    filteredData.forEach(item => {
      const status = item.statut?.libelle_statut || "Non défini";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Convertir l'objet en tableau pour Recharts
    return Object.entries(statusCount)
      .sort((a, b) => b[1] - a[1]) // Trier par nombre décroissant
      .map(([name, value]) => ({
        name,
        value
      }));
  };

  const getCategorieData = () => {
    // Créer un objet pour stocker le compte de chaque catégorie
    const categorieCount = {};
    
    // Filtrer les données selon l'année sélectionnée
    const filteredData = selectedYear === "Global"
      ? archiveData
      : archiveData.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getFullYear().toString() === selectedYear.toString();
        });

    filteredData.forEach(item => {
      const categorie = item.categorie?.libelle_categorie || "Non défini";
      categorieCount[categorie] = (categorieCount[categorie] || 0) + 1;
    });

    // Convertir l'objet en tableau pour Recharts
    return Object.entries(categorieCount)
      .sort((a, b) => b[1] - a[1]) // Trier par nombre décroissant
      .map(([name, value]) => ({
        name,
        value
      }));
  };

  const getStatsSummary = () => {
    const filteredData = selectedYear === "Global"
      ? archiveData
      : archiveData.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getFullYear().toString() === selectedYear.toString();
        });
    
    // Journalisons les statuts disponibles pour le débogage
    console.log("Statuts disponibles dans les données filtrées:", 
      [...new Set(filteredData.map(item => item.statut?.libelle_statut))]
    );
    
    const stats = [
      {
        label: "Adoptés",
        value: filteredData.filter(
          (item) => {
            // Vérification stricte du statut "adopté" avec normalisation
            return matchStatus(item.statut?.libelle_statut, "adopté");
          }
        ).length,
        icon: "🏠",
        color: "bg-green-100 text-green-800",
        trend: "+12%",
        trendColor: "text-green-500"
      },
      {
        label: "Morts Naturelles",
        value: filteredData.filter(
          (item) => {
            // Vérification stricte du statut "mort naturelle" avec normalisation
            return matchStatus(item.statut?.libelle_statut, "mort naturelle");
          }
        ).length,
        icon: "⚫",
        color: "bg-gray-100 text-gray-800",
        trend: "-5%",
        trendColor: "text-red-500"
      },
      {
        label: "Transferts",
        value: filteredData.filter(
          (item) => {
            // Vérification stricte du statut "transfert refuge" avec normalisation
            return matchStatus(item.statut?.libelle_statut, "transfert refuge");
          }
        ).length,
        icon: "🏥",
        color: "bg-blue-100 text-blue-800",
        trend: "+3%",
        trendColor: "text-green-500"
      },
      {
        label: "Chat Libre",
        value: filteredData.filter(
          (item) => {
            // Vérification stricte du statut "chat libre" avec normalisation
            return matchStatus(item.statut?.libelle_statut, "chat libre");
          }
        ).length,
        icon: "😺",
        color: "bg-purple-100 text-purple-800",
        trend: "+8%",
        trendColor: "text-green-500"
      }
    ];

    return stats;
  };

  // Fonction pour obtenir les données de provenance pour le graphique en camembert
  const getProvenanceData = () => {
    const provenanceCount = {};
    
    // Filtrer les données selon l'année sélectionnée
    const filteredData = selectedYear === "Global"
      ? archiveData
      : archiveData.filter(item => {
          const itemDate = new Date(item.created_at);
          return itemDate.getFullYear().toString() === selectedYear.toString();
        });

    filteredData.forEach(item => {
      const provenance = item.provenance?.libelle_provenance || "Non défini";
      provenanceCount[provenance] = (provenanceCount[provenance] || 0) + 1;
    });

    // Convertir l'objet en tableau pour Recharts
    return Object.entries(provenanceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        fill: COLORS[index % COLORS.length]
      }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="stats-container p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">Tableau de Bord des Statistiques</h1>
          <div className="flex items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white text-purple-800 shadow-sm font-medium"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year === "Global" ? "Toutes les années" : year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-purple-100 text-lg">
          Vue d'ensemble des statistiques {selectedYear === "Global" ? "de toutes les années" : `de ${selectedYear}`}
        </p>
      </div>

      {/* Navigation par onglets - version améliorée pour mobile */}
      <div className="flex overflow-x-auto mb-6 bg-white p-1 rounded-lg shadow-md no-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-3 whitespace-nowrap font-medium rounded-md mr-1 text-sm md:text-base flex-1 ${
            activeTab === 'general' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          Vue Générale
        </button>
        <button
          onClick={() => setActiveTab('adoptions')}
          className={`px-4 py-3 whitespace-nowrap font-medium rounded-md mr-1 text-sm md:text-base flex-1 ${
            activeTab === 'adoptions' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          Adoptions
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-3 whitespace-nowrap font-medium rounded-md mr-1 text-sm md:text-base flex-1 ${
            activeTab === 'categories' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          Catégories
        </button>
        <button
          onClick={() => setActiveTab('provenances')}
          className={`px-4 py-3 whitespace-nowrap font-medium rounded-md text-sm md:text-base flex-1 ${
            activeTab === 'provenances' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          Provenances
        </button>
      </div>

      {/* Cartes de statistiques récapitulatives - amélioré pour mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {getStatsSummary().map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4 md:p-5 transition duration-300 hover:shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-full flex items-center justify-center text-xl md:text-2xl`}>
                {stat.icon}
              </div>
              <span className={`text-xs md:text-sm font-medium flex items-center ${stat.trendColor}`}>
                {stat.trend}
                {stat.trendColor.includes('green') ? (
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-xs md:text-sm text-gray-500">{stat.label}</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contenu de l'onglet Général */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Total des adoptions */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
              {selectedYear === "Global" ? "Évolution des adoptions par année" : "Évolution des adoptions par mois"}
            </h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getMonthlyAdoptions()}>
                  <defs>
                    <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#9333ea" fillOpacity={1} fill="url(#colorAdoptions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition par statut */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
              {selectedYear === "Global" ? "Répartition par statut (toutes années)" : `Répartition par statut en ${selectedYear}`}
            </h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical"
                  data={getStatusData()}
                  margin={{
                    left: 100,
                    right: 10,
                    top: 10,
                    bottom: 10
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={90}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de l'onglet Adoptions - Version adaptée mobile */}
      {activeTab === 'adoptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg col-span-1 lg:col-span-2 border-b-4 border-purple-500">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-2 text-purple-600">
                <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center">
                {selectedYear === "Global" ? "Total des adoptions (toutes années)" : `Total des adoptions en ${selectedYear}`}
              </h2>
              <p className="text-4xl md:text-5xl font-bold text-purple-700 mt-2">{getTotalAdoptions()}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2 text-center px-4">
                {getTotalAdoptions() > 10 ? "Excellent travail ! Continuez ainsi." : "Encore quelques efforts pour atteindre vos objectifs."}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Évolution mensuelle des adoptions</h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyAdoptions()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Taux d'adoptions par catégorie</h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategorieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={({name, percent}) => `${name.substring(0, 10)}${name.length > 10 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {getCategorieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} adoption(s)`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de l'onglet Catégories - Version adaptée mobile */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
              {selectedYear === "Global" ? "Répartition par catégorie (toutes années)" : `Répartition par catégorie en ${selectedYear}`}
            </h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical"
                  data={getCategorieData()}
                  margin={{
                    left: 100,
                    right: 10,
                    top: 10,
                    bottom: 10
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={90}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {getCategorieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Distribution des catégories</h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  data={getCategorieData().map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                  }))} 
                  startAngle={0} 
                  endAngle={360}
                  barSize={20}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff', fontWeight: 'bold', fontSize: 10 }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => [`${value} animal/aux`, 'Nombre']} />
                  <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de l'onglet Provenances - Version adaptée mobile */}
      {activeTab === 'provenances' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Répartition par provenance</h2>
            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getProvenanceData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    labelLine={false}
                    label={({name, percent}) => `${name.substring(0, 10)}${name.length > 10 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {getProvenanceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} animal/aux`, 'Nombre']} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Top des provenances</h2>
            <div className="h-[300px] md:h-[350px] overflow-y-auto">
              <div className="min-w-full">
                <div className="bg-gray-50 py-3 px-4 grid grid-cols-12 gap-2 font-medium text-xs text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Provenance</div>
                  <div className="col-span-2">Nombre</div>
                  <div className="col-span-5">Pourcentage</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {getProvenanceData().map((item, index) => {
                    const total = getProvenanceData().reduce((sum, i) => sum + i.value, 0);
                    const percentage = (item.value / total * 100).toFixed(1);
                    
                    return (
                      <div key={index} className="py-3 px-4 grid grid-cols-12 gap-2 hover:bg-gray-50 items-center">
                        <div className="col-span-5 text-xs md:text-sm font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="col-span-2 text-xs md:text-sm text-gray-500">{item.value}</div>
                        <div className="col-span-5">
                          <div className="flex flex-col md:flex-row md:items-center">
                            <span className="text-xs text-gray-500 mb-1 md:mb-0 md:mr-2">{percentage}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${percentage}%`,
                                  backgroundColor: item.fill
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ajout d'un style global pour cacher les scrollbars sur les conteneurs à défilement horizontal */}
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Stats;
