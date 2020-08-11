import React from 'react'
import './styles.css'

function NewsItem({ article }) {
    return (
        <div className="container-news-holder">
            <div className="img-container">
                <img className='img-fluid' src={article.urlToImage} alt={article.description}>
                </img>
            </div>
            <div className="text-container">
                <h5 className="news-title">
                    {article.title}
                </h5>
                <span className="news-description">
                    {article.description}
                </span>
            </div>
        </div>
    )
}

export default NewsItem