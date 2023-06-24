export const gridSize = 20;
export const winnerCount = gridSize < 8 ? 3 : 5;
export const formatTime = (totalTime: number) => {
    const seconds = Math.floor((totalTime / 1000) % 60);
    const minutes = Math.floor((totalTime / (1000 * 60)) % 60);
    const hours = Math.floor(totalTime / (1000 * 60 * 60));

    let formattedTime = "";

    if (hours > 0) {
        formattedTime += `${hours} hour${hours === 1 ? "" : "s"}`;
        if (minutes > 0 || seconds > 0) {
            formattedTime += " ";
        }
    }

    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes === 1 ? "" : "s"}`;
        if (seconds > 0) {
            formattedTime += " ";
        }
    }

    if (seconds > 0 || formattedTime === "") {
        formattedTime += `${seconds} second${seconds === 1 ? "" : "s"}`;
    }

    return formattedTime;
};

export const defaultValueSquares = (() =>
    Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(null)))();
