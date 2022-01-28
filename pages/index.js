import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';


function Title(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>
        {
          `
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['000']};
                    font-size: 24px;
                    font-weight:600;
                }
            `
        }
      </style>
    </>
  )
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState('j-novaes');
  const [name, setName] = React.useState('');
  const [userImage, setUserImage] = React.useState(`https://github.com/${username}.png`);
  const roteamento = useRouter();

  useEffect(() => {
    if (username.length > 2) {
      setTimeout(() => {
        axios.get(`https://api.github.com/users/${username}`)
          .then(res => {
            if (res) {
              setName(res.data.name);
              setUserImage(`https://github.com/${username}.png`);
            } else {
              setName('');
            }
          })
          .catch(err =>{
            setName(''); 
            console.log('Deu ruim')
          }
            
          )
      }, 500)
    }
  }, [username])

  function handleUsername(event) {
    setUsername(event.target.value);
    /*    useEffect(() => {
          setUsername(event.target.value);
        }, getName);
        console.log(username)
        if(username.length > 2) {
            axios.get(`https://api.github.com/users/${username}`)
            .then(res => {
                if(res){
                    setName((prevState) => res.data.name);
                } else {
                    setName('');
                }
                
            })
            .catch(err => 
                setName('')
            )
        }*/
  }

  function getName() {
    if (username.length > 2) {
      axios.get(`https://api.github.com/users/${username}`)
        .then(res => {
          if (res) {
            setName((prevState) => res.data.name);
          } else {
            setName('');
          }

        })
        .catch(err =>
          setName('')
        )
    }
  }

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"

            onSubmit={(event) => {
              event.preventDefault();
              roteamento.push('/chat')
            }}

            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>

            <TextField
              value={username}
              onChange={(event) => handleUsername(event)}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                }
              }}
            />
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={username.length > 2 ? userImage : ''}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {username}
            </Text>

            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {name}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}