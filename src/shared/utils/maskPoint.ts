
export class Point {
    constructor(public x: number, public y: number, public id: string) { }

    toString(): string {
        return `(x: ${this.x}, y: ${this.y})`;
    }


    static arrayToRequest(points: Point[]): string {
        return points.map(point => `${point.x},${point.y}`).join(',')
    }

    static parseCoordinates = (coordString: string): Point[] => {
        const numbers = coordString.split(',').map(Number);
        const points: Point[] = [];
        for (let i = 0; i < numbers.length; i += 2) {
            points.push(new Point(numbers[i], numbers[i + 1], `point_${i + 1}`))
        }
        return points;
    }

    static arrayToString(points: Point[]): string {
        return points.map(point => point.toString()).join(', ');
    }
}

export const extractMaskNumber = (str: string): number | null => {
    const match = str.match(/\d+$/);
    if (match) {
        return parseInt(match[0], 10);
    } else {
        return null;
    }
}