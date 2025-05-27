import fetch from 'node-fetch';

const buscarPersonaje = async (nombrePersonaje) => {
  const query = `
    query ($search: String) {
      Character(search: $search) {
        id
        name {
          full
          native
        }
        image {
        large
        }
        description
        media {
          edges {
            node {
              title {
                romaji
                english
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    search: nombrePersonaje
  };

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });


    
    const data = await response.json();

    if (data.data.Character) {
      const personaje = data.data.Character;
      console.log(`Nombre: ${personaje.name.full}`);
      console.log(`Nombre Nativo: ${personaje.name.native}`);
      console.log(`ID: ${personaje.id}`);
      console.log(`Descripción: ${personaje.description}`);
      console.log(`Imagen: ${personaje.image.large}`);
      console.log('Apariciones en media:');
      personaje.media.edges.forEach((media) => {
        console.log(`- ${media.node.title.english} || ${media.node.title.romaji}`);
      });
    } else {
      console.log('Personaje no encontrado.');
    }
    
  } catch (error) {
    console.error('Error al buscar el personaje:', error);
  }
};

// Uso
const personaje = await buscarPersonaje('Naruto Uzumaki');
console.log(Sakura);
export default buscarPersonaje;

