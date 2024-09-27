import React, { useEffect, useState } from "react";
import "../styles/Hero.css";

const Tiles: React.FC = () => {
    const [tiles, setTiles] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const newTiles = [];
        for (let i = 0; i < 1599; i++) {
            newTiles.push(<div key={i} className="tile"></div>);
        }
        setTiles(newTiles);
    }, []);

    return <>{tiles}</>;
};

export default Tiles;