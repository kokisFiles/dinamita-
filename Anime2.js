import axios from "axios";
import translate from "google-translate-api-x"; // Importa la API de traducción
import fs from 'fs';

const BASE_URL = "https://graphql.anilist.co";


const fetchFromAniList = async (query, variables = {}) => {
  try {
    const response = await axios.post(BASE_URL, {
      query,
      variables,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al consultar AniList API:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const searchAnime = async (page) => {
  const query = `
            query {
                Page(page: ${page}, perPage: 50) {
                    media(type: ANIME, sort: ID) {
                        id
                        title {
                            romaji
                            english
                            native
                        }
                        description
                        coverImage {
                          large
                          medium
                          color
                          extraLarge
                        }
                        status
                        episodes
                        genres
                        popularity
                        averageScore
                        format
                        characters {
                            edges {
                                node {
                                    id
                                    name {
                                        full
                                    }
                                    image {
                                        large
                                    }
                                }
                                role
                            }
                        }
                    }
                }
            }
        `;

  // Obtener los datos de los animes
  const data = await fetchFromAniList(query);

console.log(`Datos obtenido ${data}`)
  return data;
};

const buscarAnime = async (page) => {


  try {
    console.log(`Buscando en la página ${page}`)
    const data = await searchAnime(page);
    let anime;

for (let i = 0; i <= data.Page.media.length; i++){
  console.log(`Guardando el anime id ${i}`)
  console.log(`Porcentaje de completado > ${i / 1000 * 100}%`)
    anime = data.Page.media[i];


    const description = anime.description

    const cleanedDescription = description
    ? description.replace(/<[^>]*>/g, "")
    : "No disponible";

  const translatedDescription = await translate(cleanedDescription, {
    to: "es",
    rejectOnFailure: false,
  });

  anime.description = translatedDescription.text

  console.log(JSON.stringify(anime, null, 2));

// Leer el archivo JSON
const json = JSON.parse(fs.readFileSync("./Anime2.json", "utf8"));

// Agregar el nuevo anime al array
json.push(anime); // ← asegurate de que `anime` sea un objeto válido

// Escribir el array actualizado al archivo
fs.writeFileSync("./Anime2.json", JSON.stringify(json, null, 2), "utf8");

}
  } catch (error) {
    console.error("Error al buscar anime:", error.message);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function inicio(){
let page = 21;
while (page <= 40) {
  console.log("Iniciando..." + page)
  await buscarAnime(page);
  await sleep(5000);
  ++page
}
}

await inicio()
