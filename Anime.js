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

const searchAnime = async (numero, page) => {
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
  console.log(data);
  const anime = data.Page.media[numero];

  return anime;
};

const buscarAnime = async (numero, page) => {


  try {
    const anime = await searchAnime(numero, page);
    if (!anime) {
      console.log(
        "> No se encontró ningún anime con ese nombre. Intenta nuevamente"
      );
      return;
    }

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
const json = JSON.parse(fs.readFileSync("./Anime1.json", "utf8"));

// Agregar el nuevo anime al array
json.push(anime); // ← asegurate de que `anime` sea un objeto válido

// Escribir el array actualizado al archivo
fs.writeFileSync("./Anime1.json", JSON.stringify(json, null, 2), "utf8");


  } catch (error) {
    console.error("Error al buscar anime:", error.message);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ejecutar() {
  let page = 1;
  let i = 0;
  
  while (page <= 20) {
    await buscarAnime(i, page);
    await sleep(5000);
    i++;
  
    if (i >= 50) {
      i = 0;
      page++;
    }
  }
  
}

ejecutar();

