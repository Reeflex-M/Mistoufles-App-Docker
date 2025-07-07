import { useState } from "react";
import PropTypes from "prop-types";
import { ACCESS_TOKEN } from "../constants";

function FormCreateFA({ onClose }) {
  const [prenom_fa, setPrenomFa] = useState("");
  const [commune_fa, setCommuneFa] = useState("");
  const [libelle_reseausociaux, setLibelle_reseausociaux] = useState("");
  const [telephone_fa, setTelephone_fa] = useState("");
  const [email_fa, setEmailFa] = useState("");
  const [libelle_veterinaire, setLibelle_veterinaire] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      setError("Vous devez être connecté pour créer une FA");
      return;
    }

    if (!prenom_fa.trim()) {
      setError("Le champ 'Prénom' est requis");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/fa/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            prenom_fa,
            commune_fa,
            libelle_reseausociaux,
            telephone_fa,
            email_fa,
            libelle_veterinaire,
            note,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du FA");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur est survenue lors de la création de la FA");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg flex flex-col"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center pb-2 border-b-2 border-purple-200">
            Nouvelle Famille d&apos;Accueil
          </h2>

          {(error || success) && (
            <div className="mb-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">FA créée avec succès!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {/* Colonne 1 */}
            <div className="col-span-1">
              <div className="space-y-4">
                <div className="group">
                  <label
                    htmlFor="prenom_fa"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Prénom*
                  </label>
                  <input
                    type="text"
                    id="prenom_fa"
                    value={prenom_fa}
                    onChange={(e) => setPrenomFa(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="Prénom de la FA"
                    required
                  />
                </div>

                <div className="group">
                  <label
                    htmlFor="commune_fa"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Commune
                  </label>
                  <input
                    type="text"
                    id="commune_fa"
                    value={commune_fa}
                    onChange={(e) => setCommuneFa(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="Ville"
                  />
                </div>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="col-span-1">
              <div className="space-y-4">
                <div className="group">
                  <label
                    htmlFor="telephone_fa"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone_fa"
                    value={telephone_fa}
                    onChange={(e) => setTelephone_fa(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="0X XX XX XX XX"
                  />
                </div>

                <div className="group">
                  <label
                    htmlFor="email_fa"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email_fa"
                    value={email_fa}
                    onChange={(e) => setEmailFa(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="Adresse email"
                  />
                </div>
              </div>
            </div>

            {/* Colonne 3 */}
            <div className="col-span-1">
              <div className="space-y-4">
                <div className="group">
                  <label
                    htmlFor="libelle_reseausociaux"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Réseaux sociaux
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">@</span>
                    </div>
                    <input
                      type="text"
                      id="libelle_reseausociaux"
                      value={libelle_reseausociaux}
                      onChange={(e) => setLibelle_reseausociaux(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                      placeholder="pseudo"
                    />
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="libelle_veterinaire"
                    className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                  >
                    Vétérinaire
                  </label>
                  <input
                    type="text"
                    id="libelle_veterinaire"
                    value={libelle_veterinaire}
                    onChange={(e) => setLibelle_veterinaire(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    placeholder="Nom du vétérinaire"
                  />
                </div>
              </div>
            </div>

            {/* Notes - pleine largeur */}
            <div className="col-span-3">
              <div className="group">
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-gray-700 block mb-1 group-focus-within:text-purple-700 transition-colors"
                >
                  Notes
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-all duration-200 ease-in-out focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none"
                  rows="2"
                  placeholder="Informations complémentaires..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 p-4 bg-gray-50 rounded-b-lg border-t">
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-all duration-300 font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex justify-center items-center min-w-[100px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </>
              ) : "Créer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

FormCreateFA.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FormCreateFA;
