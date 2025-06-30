export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Mot de passe oublié</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Entrez votre adresse e-mail pour réinitialiser votre mot de passe.
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-yellow-300"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>
      </div>
    </div>
  );
}
