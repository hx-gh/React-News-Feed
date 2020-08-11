import React, { useState, useEffect } from "react";
import io from 'socket.io-client'
import NewsItem from '../../Components/NewsItem'
import './styles.css'

const socket = io("http://localhost:4001")
socket.on('connect', () => console.log(`IO Connected => A new connection has been established`))

function Main() {
  const [BrData, updateBrData] = useState([{ title: "Estou Carregando" }])
  const [UsData, updateUsData] = useState([{ title: "Estou Carregando" }])
  const [EcData, updateEcData] = useState([{ title: "Estou Carregando" }])

  useEffect(() => {
    function handleNewMessage(data) {
      updateBrData(data)
    }
    socket.on('api.data.br', handleNewMessage)
    return () => socket.off('api.data.br', handleNewMessage)
  }, [BrData])

  useEffect(() => {
    function handleNewMessage(data) {
      updateUsData(data)
    }
    socket.on('api.data.us', handleNewMessage)
    return () => socket.off('api.data.us', handleNewMessage)
  }, [UsData])

  useEffect(() => {
    function handleNewMessage(data) {
      updateEcData(data)
    }
    socket.on('api.data.ec', handleNewMessage)
    return () => socket.off('api.data.ec', handleNewMessage)
  }, [EcData])

  return (
    <body>
      <div className="container">

        <div className="news-holder">
          <div className="news-title-holder">
            <h5 className="news-holder-title">Noticias do Brasil</h5>
          </div>
          <div className="news-body">
            {
              BrData.map(article => {
                return <NewsItem article={article} />
              })
            }
          </div>
        </div>
        <div className="news-holder">
          <div className="news-title-holder">
            <h5 className="news-holder-title">Noticias dos Estados Unidos</h5>
          </div>
          <div className="news-body">
            {
              UsData.map(article => {
                return <NewsItem article={article} />
              })
            }
          </div>
        </div>
        <div className="news-holder">
          <div className="news-title-holder">
            <h5 className="news-holder-title">Noticias de Economia</h5>
          </div>
          <div className="news-body">
            {
              EcData.map(article => {
                return <NewsItem article={article} />
              })
            }
          </div>
        </div>

      </div>
    </body>
  )
}

export default Main;