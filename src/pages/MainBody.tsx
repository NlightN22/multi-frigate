import { Container, Flex, Group, Text } from '@mantine/core';
import ProductTable, { TableAdapter } from '../widgets/ProductTable';
import HeadSearch from '../shared/components/HeadSearch';
import ViewSelector, { SelectorViewState } from '../shared/components/ViewSelector';
import { useContext, useState, useEffect } from 'react';
import ProductGrid, { GridAdapter } from '../shared/components/grid.aps/ProductGrid';
import { getCookie, setCookie } from 'cookies-next';
import { Context } from '..';
import { observer } from 'mobx-react-lite'
import CenterLoader from '../shared/components/CenterLoader';

const MainBody = observer(() => {
    const { productStore, cartStore, sideBarsStore } = useContext(Context)
    const { updateProductFromServer, products, isLoading: productsLoading } = productStore
    const { updateCartFromServer, products: cartProducts, isLoading: cardLoading } = cartStore

    const [viewState, setTableState] = useState(getCookie('aps-main-view') as SelectorViewState || SelectorViewState.GRID)
    const handleToggleState = (state: SelectorViewState) => {
        setCookie('aps-main-view', state, { maxAge: 60 * 60 * 24 * 30 });
        setTableState(state)
    }

    useEffect(() => {
        updateProductFromServer()
        updateCartFromServer()
        sideBarsStore.setLeftSidebar(<div />)
    }, [])

    if (productsLoading || cardLoading) return <CenterLoader />
    if (productsLoading || cardLoading) return <div>Error</div> // add state manager


    let tableData: TableAdapter[] = []
    let gridData: GridAdapter[] = []
    if (products && cartProducts) {
        tableData = productStore.mapToTable(products, cartProducts)
        gridData = productStore.mapToGrid(products, cartProducts)
    }

    return (
        <Flex direction='column' h='100%'>
            <Flex justify='space-between' align='center' w='100%'>
                <Group
                w='25%'
                >
                </Group>
                <Group
                    w='50%'
                    style={{
                        justifyContent: 'center',
                    }}
                ><HeadSearch /></Group>
                <Group
                    w='25%'
                    position="right">
                    <ViewSelector state={viewState} onChange={handleToggleState} />
                </Group>
            </Flex>
        </Flex>
    );
})

export default MainBody;