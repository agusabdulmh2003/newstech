"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchNews } from "../utils/fetchNews"; // Pastikan jalur ini benar
import Toast from "react-simple-toasts"; // Pastikan untuk menginstal pustaka ini

export default function Admin() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Teknologi, Otomotif"); // Kategori default
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // Jumlah artikel per halaman

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const response = await fetchNews(); // Memanggil fungsi fetchNews
        setArticles(response);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setMessage("Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();
    const newArticle = { title, description, url, category };
    try {
      await axios.post("https://api.example.com/articles", newArticle); // Ganti dengan API Anda
      setArticles([...articles, newArticle]);
      setMessage("Artikel berhasil ditambahkan!");
      Toast("Artikel berhasil ditambahkan!"); // Menampilkan toast
      resetForm();
    } catch (error) {
      console.error("Error adding article:", error);
      setMessage("Gagal menambahkan artikel.");
    }
  };

  const handleEditArticle = (article) => {
    setTitle(article.title);
    setDescription(article.description);
    setUrl(article.url);
    setCategory(article.category); // Menyimpan kategori saat mengedit
    setIsEditing(true);
    setCurrentArticleId(article.id); // Ganti dengan ID artikel yang sesuai
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    const updatedArticle = { title, description, url, category };
    try {
      await axios.put(`https://api.example.com/articles/${currentArticleId}`, updatedArticle); // Ganti dengan API Anda
      setArticles(articles.map((article) => (article.id === currentArticleId ? updatedArticle : article)));
      setMessage("Artikel berhasil diperbarui!");
      Toast("Artikel berhasil diperbarui!"); // Menampilkan toast
      resetForm();
    } catch (error) {
      console.error("Error updating article:", error);
      setMessage("Gagal memperbarui artikel.");
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await axios.delete(`https://api.example.com/articles/${id}`); // Ganti dengan API Anda
      setArticles(articles.filter((article) => article.id !== id));
      setMessage("Artikel berhasil dihapus!");
      Toast("Artikel berhasil dihapus!"); // Menampilkan toast
    } catch (error) {
      console.error("Error deleting article:", error);
      setMessage("Gagal menghapus artikel.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setCategory("Teknologi"); // Reset kategori ke default
    setIsEditing(false);
    setCurrentArticleId(null);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-4xl font-bold text-center mb-6">Admin Berita</h1>

      <button onClick={() => setDarkMode(!darkMode)} className="mb-4 p-2 bg-gray-500 text-white rounded">
        {darkMode ? "Mode Terang" : "Mode Gelap"}
      </button>

      {message && <div className="mb-4 text-green-500">{message}</div>}

      <input
        type="text"
        placeholder="Cari artikel..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <form onSubmit={isEditing ? handleUpdateArticle : handleAddArticle} className="mb-6">
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="url"
          placeholder="URL Gambar"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        {url && (
          <div className="mb-2">
            <img src={url} alt="Preview" className="w-full h-48 object-cover rounded-md" />
          </div>
        )}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="Teknologi">Teknologi</option>
          <option value="Olahraga">Olahraga</option>
          <option value="Kesehatan">Kesehatan</option>
          <option value="Bisnis">Bisnis</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isEditing ? "Perbarui Artikel" : "Tambah Artikel"}
        </button>
        {isEditing && (
          <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded ml-2">
            Batal
          </button>
        )}
      </form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentArticles.map((article, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-xl font-semibold mt-3">{article.title}</h2>
              <p className="text-gray-700 text-sm">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block hover:underline">
                Baca Selengkapnya →
              </a>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditArticle(article)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArticle(article.id)} // Ganti dengan ID artikel yang sesuai
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 p-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}