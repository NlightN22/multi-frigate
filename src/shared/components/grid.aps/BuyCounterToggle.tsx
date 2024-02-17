import { useCounter } from '@mantine/hooks';
import RowCounter from '../table.aps/RowCounter';
import { Button, createStyles } from '@mantine/core';
import { productString } from '../../strings/product.strings';
import { v4 as uuidv4 } from 'uuid'

const useStyles = createStyles((theme) => ({
    counter: {
        height: Button.defaultProps?.h?.toString() || '36px'
    },
}))
interface BuyCounterToggleProps {
    counter?: number
    setValue?(value: number): void
}

const BuyCounterToggle = ({ counter, setValue }: BuyCounterToggleProps) => {
    const { classes } = useStyles();
    // const [count, handlers] = useCounter(counter, { min: 0 })

    const handleSetCount = (value: number) => {
        if (setValue) setValue(value)
        // else handlers.set(value)
    }

    const handleBuyClick = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        handleSetCount(1)
    }

    // useEffect(() => {
    //     console.log("render BuyCounterToggle")
    // })

    if (counter && counter > 0) {
        return (
            <div className={classes.counter}>
                <RowCounter key={uuidv4()} counter={counter} setValue={handleSetCount} />
            </div>
        )
    }

    return (
        <Button w="100%" onClick={handleBuyClick}
        > {productString.buy}</Button >
    );
};

export default BuyCounterToggle;

