import axios from "axios";
import translate from "google-translate-api-x"; // Importa la API de traducción

const BASE_URL = "https://graphql.anilist.co";

const page = 1;

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

const searchAnime = async (numero) => {
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

const buscarAnime = async (numero) => {
  try {
    const anime = await searchAnime(numero);
    if (!anime) {
      console.log(
        "> No se encontró ningún anime con ese nombre. Intenta nuevamente"
      );
      return;
    }

    console.log(JSON.stringify(anime, null, 2));
    /*
  
      const {
        title,
        description,
        coverImage,
        status,
        episodes,
        genres,
        popularity,
        averageScore,
        format,
      } = anime.Media;
      const imageUrl = coverImage.extraLarge;
  
      const cleanedDescription = description
        ? description.replace(/<[^>]*>/g, "")
        : "No disponible";
  
      const translatedDescription = await translate(cleanedDescription, {
        to: "es",
        rejectOnFailure: false,
      });
      const popularityFormatted = popularity
        ? popularity.toLocaleString()
        : "Desconocido";
  
      // Formatear el mensaje con más emojis y detalles
      const response = `◈  *${
        title.romaji || title.english || "Título Desconocido"
      }*  ◈
  > ${title.native || "---"}
       
  ${translatedDescription.text}
  
  📝 Episodios:  *${episodes || "Desconocido"}* (${format || "Desconocido"})
  
  🎭 Géneros: ${genres ? genres.join(", ") : "No disponible"}
  
  🔥 Popularidad:  *${popularityFormatted || "Desconocido"}*
  
  📶 Puntuación:  *${averageScore || "N/A"} %*`;
  

      console.log(`${response}\nImagen: ${imageUrl}`)
      */
  } catch (error) {
    console.error("Error al buscar anime:", error.message);
  }
};

await buscarAnime(0);
