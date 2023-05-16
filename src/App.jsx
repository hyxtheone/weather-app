import './app.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";

function App() {

    const inputRef = useRef(null);
    const [data, setData] = useState(null)
    const [isFetching, setIsFetching] = useState(true)
    const [defaultLocation, setDefaultLocation] = useState('')

    function apiRequest(location) {
        axios.get(`https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${location}&aqi=no&lang=pt`)
            .then(response => {
                setData(response.data)
                setIsFetching(false)
            }).catch(() => {
                // pass
        })
    }

    function getLocation() {
        axios.get(`https://api.geoapify.com/v1/ipinfo?&apiKey=${import.meta.env.VITE_IP_KEY}`).then(data => {
            setDefaultLocation(data.data.city.name + ' ' + data.data.state.name + ' ' +  data.data.country.name_native)
        }).catch(() => {
            // pass
        })
    }

    useEffect(() => {
        getLocation()
    }, []);

    useEffect(() => {
        apiRequest(defaultLocation.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
    }, [defaultLocation]);



    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            apiRequest(inputRef.current.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
        }
    }

    return (
        <div className="App">
            <div className="container">
                <header className={"header-input"}>
                    <div>
                        <input className={"location-input"} placeholder={"Digite a localização."} onKeyPress={(e) => {handleKeyPress(e)}} ref={inputRef}/>
                        <p className={"observations"}>Press Enter to Send.<br/>Tente a busca exterior em inglês!</p>
                    </div>
                    {isFetching ? <></> : (
                        <div>
                            <h1 className={"location"}>{data.location.name},</h1>
                            <p className={"region"}>{data.location.region}, {data.location.country}.</p>
                        </div>
                    )}
                </header>
                {isFetching ? <p className={"loading"}>Loading...</p> : (
                    <main className={"main-data"}>
                        <div className={"temperature"}>

                            <p className={"temp"}>{data.current.temp_c}° C</p>
                            <p className={"last-update"}>
                                Atualizado: {data.current.last_updated}
                            </p>
                        </div>
                        <div className={"weather"}>
                            <img className={"img"} src={`https://cdn.weatherapi.com/weather/128x128/${data.current.condition.icon.split('/')[5]}/${data.current.condition.icon.split('/')[6]}`} alt={"Weather pic"}
                            width={150}
                            height={150}/>
                            <p className={"weather-label"}>{data.current.condition.text}</p>
                        </div>
                    </main>
                )}
            </div>
        </div>
    )
}

export default App
