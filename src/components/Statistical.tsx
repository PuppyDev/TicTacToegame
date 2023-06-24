import { useEffect, useState } from "react";
import { WinnerPlayerType } from "../app/globalSlice";
import { useAppSelector } from "../app/hook";

// interface IStatisticalProps {

// }

interface IWinStatis {
    totalGameWin: number;
    averageStep: number;
}

interface IAverageGame {
    totalGame: number;
    averageStep: number;
    xWinStatis: IWinStatis;
    yWinStatis: IWinStatis;
}

const Statistical = () => {
    const [averageGames, setAverageGames] = useState<IAverageGame>();
    const { isGameOver } = useAppSelector((selector) => selector.globalSice);

    const fetchData = () => {
        const statisticals =
            (JSON.parse(localStorage.getItem("statisticals") as string) as {
                step: number;
                winnerPlayer: WinnerPlayerType;
                historyList: string[][][];
            }[]) || [];

        const totalStep = statisticals.reduce((acc, statisticalElement) => {
            return (acc += statisticalElement.step);
        }, 0);

        const totalGame = statisticals ? statisticals.length : 0;

        const xWinStatis = {
            totalGameWin: 0,
            averageStep: 0,
        };

        const yWinStatis = {
            totalGameWin: 0,
            averageStep: 0,
        };
        for (const statisEle of statisticals) {
            if (statisEle.winnerPlayer === "X") {
                xWinStatis.totalGameWin += 1;
                xWinStatis.averageStep += statisEle.step;
            } else {
                yWinStatis.totalGameWin += 1;
                yWinStatis.averageStep += statisEle.step;
            }
        }

        setAverageGames({
            totalGame: totalGame || 0,
            averageStep: totalStep / totalGame,
            xWinStatis,
            yWinStatis,
        });
    };

    useEffect(() => {
        fetchData();
    }, [isGameOver]);

    return (
        <div>
            <p>totalGames : {averageGames?.totalGame || 0}</p>
            <p>average Steps Per Game : {Math.round(averageGames?.averageStep || 0)}</p>
            <p>
                average X player : - average step to win{" "}
                {averageGames?.xWinStatis &&
                    Math.round(averageGames?.xWinStatis.averageStep / averageGames?.totalGame || 0) +
                        " and average win rate " +
                        ((averageGames?.xWinStatis.totalGameWin / averageGames?.totalGame) * 100 || 0).toFixed(2)}
                %
            </p>
            <p>
                average Y player : - average step to win{" "}
                {averageGames?.yWinStatis &&
                    Math.round(averageGames?.yWinStatis.averageStep / averageGames?.totalGame || 0) +
                        " and average win rate " +
                        ((averageGames?.yWinStatis.totalGameWin / averageGames?.totalGame) * 100 || 0).toFixed(2)}
                %
            </p>
        </div>
    );
};

export default Statistical;
