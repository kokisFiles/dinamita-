import axios from 'axios';
import translate from "google-translate-api-x"; // Importa la API de traducción

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
  
  
  const searchAnime = async (search) => {
    const query = `
          query ($search: String) {
              Media(search: $search, type: ANIME) {
                  id
                  title {
                      romaji
                      english
                      native
                  }
                  description
                  coverImage {
                      extraLarge
                  }
                  status
                  episodes
                  format
                  genres
                  popularity
                  season
                  trending
                  averageScore
                  rankings {
                      rank
                      type
                      allTime
                      season
                      year
                  }
              }
          }
      `;
    return fetchFromAniList(query, { search });
  };
  const buscarAnime = async (buscarAnime) => {
  

    console.log(`Buscando ${buscarAnime}`);

  
    try {
      const anime = await searchAnime(buscarAnime);
      if (!anime || !anime.Media) {
          console.log("> No se encontró ningún anime con ese nombre. Intenta nuevamente");
        return;
      }
  
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
    } catch (error) {
      console.error("Error al buscar anime:", error.message);
    }
  };

await buscarAnime("Naruto")