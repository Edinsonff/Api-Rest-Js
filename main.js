const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
});
api.defaults.headers.common['x-api-key'] = 'live_iUvCYpEliu0AiJVCUKjeKkFh2loIspGK2aaToFZ6LbnJOwxSYx5C0o9Mw9hU0icK';

const API_URL_RANDOM = '/images/search?limit=2';
const API_URL_FAVOTITES = '/favourites';
const API_URL_FAVOTITES_DELETE = id => `/favourites/${id}`;
const API_URL_UPLOAD = '/images/upload';

const spanError = document.getElementById('error');

// Cargar michis aleatorios
async function loadRandomMichis() {
  try {
    const res = await api.get(API_URL_RANDOM);
    const data = res.data;

    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');

    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavoriteMichi(data[0].id);
    btn2.onclick = () => saveFavoriteMichi(data[1].id);

  } catch (error) {
    spanError.innerHTML = `Hubo un error: ${error.response.status}`;
  }
}

// Cargar michis favoritos
async function loadFavouriteMichis() {
  try {
    const res = await api.get(API_URL_FAVOTITES);
    const data = res.data;

    const section = document.getElementById('favoriteMichis');
    section.innerHTML = '<h2>Michis Favoritos</h2>'; // Mantén la clase michi-grid aplicada directamente en el HTML

    data.forEach(michi => createMichiCard(section, michi.image.url, michi.id));

  } catch (error) {
    spanError.innerHTML = `Hubo un error: ${error.response.status} ${error.response.data.message}`;
  }
}


// Crear tarjetas de michis
function createMichiCard(section, imageUrl, michiId) {
  const article = document.createElement('article');
  const img = document.createElement('img');
  const btn = document.createElement('button');

  img.src = imageUrl;
  img.width = 150;

  btn.textContent = '✖';
  btn.classList.add('btn-remove');
  btn.onclick = () => deleteFavoriteMichi(michiId);

  article.appendChild(img);
  article.appendChild(btn);
  section.appendChild(article);
}

// Guardar michi en favoritos
async function saveFavoriteMichi(id) {
  try {
    const { status } = await api.post(API_URL_FAVOTITES, {
      image_id: id,
    });

    if (status === 200) {
      console.log('Guardado');
      loadFavouriteMichis();
    }
  } catch (error) {
    spanError.innerHTML = `Hubo un error: ${error.response.status} ${error.response.data.message}`;
  }
}

// Eliminar michi de favoritos
async function deleteFavoriteMichi(id) {
  try {
    const res = await api.delete(API_URL_FAVOTITES_DELETE(id));

    if (res.status === 200) {
      console.log('Eliminado');
      loadFavouriteMichis();
    }
  } catch (error) {
    spanError.innerHTML = `Hubo un error: ${error.response.status} ${error.response.data.message}`;
  }
}

// Subir foto de michi
async function uploadMichiPhoto() {
  try {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);
    const res = await api.post(API_URL_UPLOAD, formData);

    if (res.status === 201) {
      console.log('Foto de michi subida');
      saveFavoriteMichi(res.data.id);
    }
  } catch (error) {
    spanError.innerHTML = `Hubo un error: ${error.response.status} ${error.response.data.message}`;
  }
}

// Previsualizar imagen antes de subirla
function previewImage() {
  const img = document.querySelector('#imagePreview');
  const file = document.querySelector('#file').files[0];
  const reader = new FileReader();

  reader.onload = () => {
    img.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Inicializar la carga de michis
loadRandomMichis();
loadFavouriteMichis();
