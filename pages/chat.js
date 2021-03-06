import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useSate } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ3MjIwOCwiZXhwIjoxOTU5MDQ4MjA4fQ.IkByJnqNkKT7c3GnT3sg8DRG2IHt-oQ3mjZwFX13V7c'
const SUPABASE_URL = 'https://pubajyetphvslihfgagf.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function listenMessagesInRealTime(addMessage) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (res) => {
            addMessage(res.new);
        })
        .subscribe();
}

export default function ChatPage() {
    // Sua lógica vai aqui
    const routing = useRouter();
    const loggedUser = routing.query.username;
    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([
        { id: 1, from: 'j-novaes', text: ':sticker:https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_1.png' }
    ])
    // ./Sua lógica vai aqui


    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessageList(data)
            }
            );
        listenMessagesInRealTime((newMessage) => {
            setMessageList((actualListValue) => {
                return([
                    newMessage,
                    ...actualListValue
                ])
            })
        });
    }, [])

    function addToSupabase() {
        supabaseClient
            .from('messages')
            .insert([
                { from: loggedUser, text: message, }
            ])
            .then(({ data }) => {
                //setMessageList([data[0], ...messageList]);
            })
    }


    function handleKeyPress(event) {
        if (event.key == 'Enter') {
            event.preventDefault();
            addToSupabase();
            setMessage('');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        addToSupabase();
        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList messageList={messageList} setMessageList={setMessageList} />

                    <Box
                        as="form"
                        onSubmit={event => { handleSubmit(event) }}
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            onChange={(event) => { setMessage(event.target.value) }}
                            onKeyPress={(event) => handleKeyPress(event, message)}
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            type="submit"
                            label='Enviar'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        ></Button>

                        <ButtonSendSticker
                            onStickerClick={(stickerURL) => {
                                supabaseClient
                                    .from('messages')
                                    .insert([
                                        { from: loggedUser, text: `:sticker:${stickerURL}`, }
                                    ])
                                    .then(({ data }) => {
                                        setMessageList([data[0], ...messageList]);
                                    })
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList({ messageList, setMessageList }) {
    //console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowX: 'hidden',
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {messageList.map((message) => {
                return (

                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            width: '100%',
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong" styleSheet={{ display: 'inline' }}>
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                    display: 'inline'
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>

                            <Text tag="strong" onClick={() => setMessageList(messageList.filter((m) => m.id != message.id))}>
                                X
                            </Text>
                        </Box>
                        {message.text.startsWith(':sticker:') ?
                            (<Image src={message.text.replace(':sticker:', '')}></Image>)
                            :
                            (message.text)}

                        {/* message.text*/}
                    </Text>
                )
            })}
        </Box>
    )
}