import { useNavigate } from "react-router-dom"

const Main = () => {
    const navigate = useNavigate()
    return(
        <div>
            <h2>Main</h2>
            <button onClick={() => navigate('/myinfo')}>MyInfo</button>
        </div>
    )
}

export default Main