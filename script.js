const API_URL = "https://sofia-miga.onrender.com/api/fotos";

const MUSIC_API = API_URL.replace("/fotos", "/musicas");


// ==========================
// FOTOS
// ==========================

const gallery = document.getElementById("gallery");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const addPhotoForm = document.getElementById("addPhotoForm");
const addImage = document.getElementById("addImage");
const addDate = document.getElementById("addDate");
const addMessage = document.getElementById("addMessage");

const modalImage = document.getElementById("modalImage");
const modalDate = document.getElementById("modalDate");
const modalDescription = document.getElementById("modalDescription");
const modalCounter = document.getElementById("modalCounter");

const previousPhoto = document.getElementById("previousPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const deletePhoto = document.getElementById("deletePhoto");

let photos = [];
let currentPhoto = 0;


// ==========================
// CONTADOR
// ==========================

const contador = document.getElementById("contador");
const dataConhecemos = new Date("2025-09-25T00:00:00");

function atualizarContador() {
    const agora = new Date();
    const diferenca = agora - dataConhecemos;

    if (diferenca < 0) {
        contador.textContent = "Ainda não nos conhecemos";
        return;
    }

    const segundosTotais = Math.floor(diferenca / 1000);

    const dias = Math.floor(segundosTotais / 86400);
    const horas = Math.floor((segundosTotais % 86400) / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;

    contador.textContent =
        `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
}

atualizarContador();
setInterval(atualizarContador, 1000);


// ==========================
// CARREGAR FOTOS
// ==========================

async function loadPhotos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar fotos.");
        }

        photos = await response.json();
        createGallery();

    } catch (error) {
        console.error(error);
        gallery.innerHTML = "<p>Não foi possível carregar as fotos.</p>";
    }
}


// ==========================
// GALERIA
// ==========================

function createGallery() {
    gallery.innerHTML = "";

    photos.forEach((photo, index) => {
        const item = document.createElement("div");

        item.className = "gallery-item";

        item.innerHTML = `
            <img
                src="${photo.url}"
                alt="${escapeHTML(photo.mensagem || "Foto")}"
                loading="lazy"
            >
        `;

        item.addEventListener("click", () => openPhoto(index));

        gallery.appendChild(item);
    });
}


// ==========================
// MODAL DA FOTO
// ==========================

function openPhoto(index) {
    currentPhoto = index;
    updatePhotoModal();

    bootstrap.Modal
        .getOrCreateInstance(document.getElementById("photoModal"))
        .show();
}

function updatePhotoModal() {
    if (!photos.length) return;

    const photo = photos[currentPhoto];

    modalImage.src = photo.url;
    modalImage.alt = photo.mensagem || "Foto";

    modalCounter.textContent =
        `${currentPhoto + 1} / ${photos.length}`;

    if (photo.data_momento) {
        const [ano, mes, dia] =
            String(photo.data_momento)
                .split("T")[0]
                .split("-");

        modalDate.textContent = `${dia}/${mes}/${ano}`;
    } else {
        modalDate.textContent = "";
    }

    modalDescription.textContent =
        photo.mensagem || "";
}

function next() {
    if (!photos.length) return;

    currentPhoto =
        (currentPhoto + 1) % photos.length;

    updatePhotoModal();
}

function previous() {
    if (!photos.length) return;

    currentPhoto =
        (currentPhoto - 1 + photos.length) % photos.length;

    updatePhotoModal();
}

nextPhoto.addEventListener("click", next);
previousPhoto.addEventListener("click", previous);


// ==========================
// TECLADO
// ==========================

document.addEventListener("keydown", event => {
    const modal = document.getElementById("photoModal");

    if (!modal.classList.contains("show")) return;

    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") previous();
});


// ==========================
// ADICIONAR FOTO
// ==========================

addPhotoBtn.addEventListener("click", () => {
    bootstrap.Modal
        .getOrCreateInstance(document.getElementById("addModal"))
        .show();
});

addPhotoForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!addImage.files[0]) {
        alert("Escolha uma foto.");
        return;
    }

    const formData = new FormData();

    formData.append("imagem", addImage.files[0]);
    formData.append("data_momento", addDate.value);
    formData.append("mensagem", addMessage.value);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.erro || "Erro ao adicionar foto."
            );
        }

        addPhotoForm.reset();

        bootstrap.Modal
            .getInstance(document.getElementById("addModal"))
            ?.hide();

        await loadPhotos();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});


// ==========================
// EXCLUIR FOTO
// ==========================

deletePhoto.addEventListener("click", async () => {
    if (!photos.length) return;

    const photo = photos[currentPhoto];

    if (!confirm("Excluir esta foto?")) return;

    try {
        const response = await fetch(
            `${API_URL}/${photo.id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.erro || "Erro ao excluir."
            );
        }

        bootstrap.Modal
            .getInstance(document.getElementById("photoModal"))
            ?.hide();

        await loadPhotos();

    } catch (error) {
        console.error(error);
        alert("Erro ao excluir: " + error.message);
    }
});


// ==========================
// MÚSICAS
// ==========================

const dailyMusic = document.getElementById("dailyMusic");
const manageMusicBtn = document.getElementById("manageMusicBtn");
const musicList = document.getElementById("musicList");
const addMusicBtn = document.getElementById("addMusicBtn");

const addMusicForm = document.getElementById("addMusicForm");
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");
const musicMessage = document.getElementById("musicMessage");
const musicYoutube = document.getElementById("musicYoutube");
const musicSpotify = document.getElementById("musicSpotify");

const musicModalTitle = document.getElementById("musicModalTitle");
const musicModalArtist = document.getElementById("musicModalArtist");
const musicModalMessage = document.getElementById("musicModalMessage");
const musicModalChosenBy = document.getElementById("musicModalChosenBy");

const musicAddedBy = document.getElementById("musicAddedBy");

const youtubeButton = document.getElementById("youtubeButton");
const spotifyButton = document.getElementById("spotifyButton");

const editMusicModal = document.getElementById("editMusicModal");
const editMusicForm = document.getElementById("editMusicForm");

const editMusicTitle = document.getElementById("editMusicTitle");
const editMusicArtist = document.getElementById("editMusicArtist");
const editMusicMessage = document.getElementById("editMusicMessage");
const editMusicYoutube = document.getElementById("editMusicYoutube");
const editMusicSpotify = document.getElementById("editMusicSpotify");

let musicas = [];
let musicaAtual = null;
let musicaEditando = null;


// ==========================
// CARREGAR MÚSICAS
// ==========================

async function loadMusicas() {
    try {
        const response = await fetch(MUSIC_API);

        if (!response.ok) {
            throw new Error("Erro ao buscar músicas.");
        }

        musicas = await response.json();

        createDailyMusic();
        createMusicList();

    } catch (error) {
        console.error("Erro ao carregar músicas:", error);
    }
}


// ==========================
// MÚSICAS DO DIA
// ==========================

function createDailyMusic() {

    const musicasDoDia = musicas
        .filter(musica => musica.musica_do_dia)
        .sort((a, b) => {

            if (a.escolhida_por === "voce") return -1;
            if (b.escolhida_por === "voce") return 1;

            return 0;
        });


    if (!musicasDoDia.length) {

        dailyMusic.innerHTML = `
            <div class="music-empty">
                <i class="bi bi-music-note"></i>
                <span>nenhuma música por enquanto</span>
            </div>
        `;

        return;
    }


    dailyMusic.innerHTML = musicasDoDia
        .map(musica => {

            const nome =
                musica.escolhida_por === "voce"
                    ? "Isaac"
                    : "Sofia";

            return `
                <div
                    class="music-note"
                    data-id="${musica.id}"
                >

                    <div class="music-note-icon">
                        <i class="bi bi-music-note"></i>
                    </div>

                    <div class="music-note-info">

                        <strong>
                            ${escapeHTML(musica.titulo)}
                        </strong>

                        <span>
                            ${escapeHTML(musica.artista)}
                            · ${nome}
                        </span>

                    </div>

                    <i class="bi bi-chevron-right music-arrow"></i>

                </div>
            `;
        })
        .join("");


    dailyMusic
        .querySelectorAll(".music-note")
        .forEach(item => {

            const musica = musicas.find(
                musica => musica.id == item.dataset.id
            );

            item.addEventListener(
                "click",
                () => openMusic(musica)
            );
        });
}   


// ==========================
// ABRIR MÚSICA
// ==========================

function openMusic(musica) {
    if (!musica) return;

    musicaAtual = musica;

    musicModalTitle.textContent = musica.titulo;
    musicModalArtist.textContent = musica.artista;
    musicModalMessage.textContent = musica.mensagem || "";

    musicModalChosenBy.textContent =
        musica.escolhida_por === "voce"
            ? "Isaac"
            : "Sofia";

    if (musica.youtube_url) {
        youtubeButton.href = musica.youtube_url;
        youtubeButton.style.display = "flex";
    } else {
        youtubeButton.style.display = "none";
    }

    if (musica.spotify_url) {
        spotifyButton.href = musica.spotify_url;
        spotifyButton.style.display = "flex";
    } else {
        spotifyButton.style.display = "none";
    }

    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById("musicModal")
        )
        .show();
}


// ==========================
// LISTA DE MÚSICAS
// ==========================

function createMusicList() {

    musicList.innerHTML = "";


    if (!musicas.length) {

        musicList.innerHTML = `
            <div class="music-empty">
                <i class="bi bi-music-note"></i>
                <span>nenhuma música cadastrada</span>
            </div>
        `;

        return;
    }


    musicas.forEach(musica => {

        const suaEscolha =
            musica.musica_do_dia &&
            musica.escolhida_por === "Isaac";

        const escolhaDela =
            musica.musica_do_dia &&
            musica.escolhida_por === "Sofia";


        const item = document.createElement("div");

        item.className = "music-list-item";


        item.innerHTML = `

            <div class="music-note-icon">
                <i class="bi bi-music-note"></i>
            </div>


            <div class="music-list-item-info">

                <strong>
                    ${escapeHTML(musica.titulo)}
                </strong>

                <span>
                    ${escapeHTML(musica.artista)}
                </span>

            </div>


            <div class="music-list-actions">

                <button
                    type="button"
                    class="day-1-btn"
                    ${suaEscolha ? "disabled" : ""}
                >
                    ${suaEscolha ? "você ✓" : "você"}
                </button>


                <button
                    type="button"
                    class="day-2-btn"
                    ${escolhaDela ? "disabled" : ""}
                >
                    ${escolhaDela ? "ela ✓" : "ela"}
                </button>


                <button
                    type="button"
                    class="edit-music-btn"
                >
                    editar
                </button>

            </div>
        `;


        item
            .querySelector(".day-1-btn")
            .addEventListener(
                "click",
                () => setMusicOfDay(musica.id, "voce")
            );


        item
            .querySelector(".day-2-btn")
            .addEventListener(
                "click",
                () => setMusicOfDay(musica.id, "ela")
            );


        item
            .querySelector(".edit-music-btn")
            .addEventListener(
                "click",
                () => openEditMusic(musica)
            );


        musicList.appendChild(item);
    });
}


// ==========================
// DEFINIR MÚSICA DO DIA
// ==========================

async function setMusicOfDay(id, pessoa) {

    try {

        const response = await fetch(
            `${MUSIC_API}/${id}/dia`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    pessoa
                })
            }
        );


        const resultado = await response.json();


        if (!response.ok) {
            throw new Error(
                resultado.erro ||
                "Erro ao definir música do dia."
            );
        }


        await loadMusicas();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ==========================
// ADICIONAR MÚSICA
// ==========================

addMusicForm.addEventListener("submit", async event => {
    event.preventDefault();

    const dados = {
    titulo: musicTitle.value.trim(),
    artista: musicArtist.value.trim(),
    mensagem: musicMessage.value.trim(),
    youtube_url: musicYoutube.value.trim(),
    spotify_url: musicSpotify.value.trim(),
    adicionada_por: musicAddedBy.value
};

    try {
        const response = await fetch(MUSIC_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.erro ||
                "Erro ao adicionar música."
            );
        }

        addMusicForm.reset();

        bootstrap.Modal
            .getInstance(
                document.getElementById("addMusicModal")
            )
            ?.hide();

        await loadMusicas();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});


// ==========================
// ABRIR LISTA
// ==========================

manageMusicBtn.addEventListener("click", () => {
    createMusicList();

    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById("musicListModal")
        )
        .show();
});


// ==========================
// ADICIONAR PELA LISTA
// ==========================

addMusicBtn.addEventListener("click", () => {

    bootstrap.Modal
        .getInstance(
            document.getElementById("musicListModal")
        )
        ?.hide();

    setTimeout(() => {

        bootstrap.Modal
            .getOrCreateInstance(
                document.getElementById("addMusicModal")
            )
            .show();

    }, 250);
});


// ==========================
// EDITAR MÚSICA
// ==========================

function openEditMusic(musica) {

    musicaEditando = musica;

    editMusicTitle.value = musica.titulo || "";
    editMusicArtist.value = musica.artista || "";
    editMusicMessage.value = musica.mensagem || "";
    editMusicYoutube.value = musica.youtube_url || "";
    editMusicSpotify.value = musica.spotify_url || "";

    bootstrap.Modal
        .getInstance(
            document.getElementById("musicListModal")
        )
        ?.hide();

    setTimeout(() => {

        bootstrap.Modal
            .getOrCreateInstance(editMusicModal)
            .show();

    }, 250);
}

editMusicForm.addEventListener("submit", async event => {

    event.preventDefault();

    if (!musicaEditando) return;

    try {

        const response = await fetch(
            `${MUSIC_API}/${musicaEditando.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    titulo: editMusicTitle.value.trim(),
                    artista: editMusicArtist.value.trim(),
                    mensagem: editMusicMessage.value.trim(),
                    youtube_url: editMusicYoutube.value.trim(),
                    spotify_url: editMusicSpotify.value.trim()
                })
            }
        );

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(
                resultado.erro ||
                "Erro ao editar música."
            );
        }

        bootstrap.Modal
            .getInstance(editMusicModal)
            ?.hide();

        musicaEditando = null;

        await loadMusicas();

    } catch (error) {

        console.error(error);

        alert(
            "Não foi possível editar a música: " +
            error.message
        );

    }
});


// ==========================
// UTILITÁRIO
// ==========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;
}


// ==========================
// INICIAR
// ==========================

loadPhotos();
loadMusicas();