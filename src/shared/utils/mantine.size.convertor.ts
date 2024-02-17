import { px, useMantineTheme } from "@mantine/core"

/**
 * Return size in px number
 * @param size use mantine size like md, lg, sm
 */
export const useMantineSize = (size: string) => {
    const theme = useMantineTheme()
    const hideSize = theme.fn.smallerThan(size)
    const numberMatch = hideSize.match(/(\d+(\.\d+)?)(?=em)/)

    if (numberMatch) {
        const number = Number(numberMatch[0])
        return px(`${number}rem`)
    } else {
        throw Error("Need em or rem mantine size number")
    }
}