const API_URL = "https://sofia-miga.onrender.com/api/fotos";

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


// =========================
// CARREGAR FOTOS
// =========================

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

        gallery.innerHTML = `
            <p>Não foi possível carregar as fotos.</p>
        `;

    }

}


// =========================
// CRIAR GALERIA
// =========================

function createGallery() {

    gallery.innerHTML = "";

    photos.forEach((photo, index) => {

        const item = document.createElement("div");

        item.classList.add("gallery-item");

        item.innerHTML = `
            <img
                src="${photo.url}"
                alt="${photo.mensagem || "Foto"}"
                loading="lazy"
            >
        `;

        item.addEventListener("click", () => {

            openPhoto(index);

        });

        gallery.appendChild(item);

    });

}


// =========================
// ABRIR FOTO
// =========================

function openPhoto(index) {

    currentPhoto = index;

    updateModal();

    const modalElement =
        document.getElementById("photoModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();

}


// =========================
// ATUALIZAR MODAL
// =========================

function updateModal() {
    if (photos.length === 0) return;

    const photo = photos[currentPhoto];

    modalImage.src = photo.url;
    modalImage.alt = photo.mensagem || "Foto";

    modalCounter.textContent =
        `${currentPhoto + 1} / ${photos.length}`;

    // DATA
    if (photo.data_momento) {
    const data = String(photo.data_momento).split("T")[0];

    const [ano, mes, dia] = data.split("-");

    modalDate.textContent = `${dia}/${mes}/${ano}`;
} else {
    modalDate.textContent = "";
}

    // MENSAGEM
    modalDescription.textContent =
        photo.mensagem || "";
}


// =========================
// PRÓXIMA FOTO
// =========================

function next() {

    if (photos.length === 0) {
        return;
    }

    currentPhoto++;

    if (currentPhoto >= photos.length) {

        currentPhoto = 0;

    }

    updateModal();

}


// =========================
// FOTO ANTERIOR
// =========================

function previous() {

    if (photos.length === 0) {
        return;
    }

    currentPhoto--;

    if (currentPhoto < 0) {

        currentPhoto = photos.length - 1;

    }

    updateModal();

}


// =========================
// BOTÕES DE NAVEGAÇÃO
// =========================

nextPhoto.addEventListener(
    "click",
    next
);

previousPhoto.addEventListener(
    "click",
    previous
);


// =========================
// TECLADO
// =========================

document.addEventListener(
    "keydown",
    (event) => {

        const modal =
            document.getElementById("photoModal");

        if (!modal.classList.contains("show")) {
            return;
        }

        if (event.key === "ArrowRight") {
            next();
        }

        if (event.key === "ArrowLeft") {
            previous();
        }

    }
);


// =========================
// ABRIR MODAL DE ADICIONAR
// =========================

addPhotoBtn.addEventListener(
    "click",
    () => {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("addModal")
            );

        modal.show();

    }
);


// =========================
// ADICIONAR FOTO
// =========================

addPhotoForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // Verificar foto

        if (!addImage.files[0]) {

            alert("Escolha uma foto.");

            return;

        }


        // Criar FormData

        const formData = new FormData();

        formData.append(
            "imagem",
            addImage.files[0]
        );

        formData.append(
            "data_momento",
            addDate.value
        );

        formData.append(
            "mensagem",
            addMessage.value
        );


        try {

            const response = await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


            const resultado =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    resultado.erro ||
                    "Erro ao adicionar foto."
                );

            }


            // Limpar formulário

            addPhotoForm.reset();


            // Fechar modal

            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("addModal")
                );

            modal.hide();


            // Atualizar galeria

            await loadPhotos();


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);


// =========================
// EXCLUIR FOTO
// =========================

deletePhoto.addEventListener(
    "click",
    async () => {

        if (photos.length === 0) {
            return;
        }


        const photo =
            photos[currentPhoto];


        const confirmar =
            confirm("Excluir esta foto?");


        if (!confirmar) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${photo.id}`,
                {
                    method: "DELETE"
                }
            );


            const resultado =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    resultado.erro ||
                    "Erro ao excluir."
                );

            }


            // Fechar modal

            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("photoModal")
                );

            modal.hide();


            // Atualizar galeria

            await loadPhotos();


        } catch (error) {

    console.error("ERRO AO SALVAR:", error);

    alert(
        "Erro ao salvar: " +
        error.message
    );

}

    }
);


// =========================
// INICIAR
// =========================

loadPhotos();

const contador = document.getElementById("contador");

const dataConhecemos = new Date("2025-09-25T00:00:00");

function atualizarContador() {
    const agora = new Date();

    let diferenca = agora - dataConhecemos;

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