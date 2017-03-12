var players = {
    first: {
        direction: 'left',
        score: 0,
        startPosition: {
            x: 0,
            y: -vars.sizeOfSideOfTriangle
        }
    },
    second: {
        direction: 'left',
        score: 0,
        startPosition: {
            x: -6,
            y: - Math.sqrt(3) * 6 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)
        }
    },
    third: {
        direction: 'left',
        score: 0,
        startPosition: {
            x: 6,
            y: - Math.sqrt(3) * 6 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)
        }
    }
};