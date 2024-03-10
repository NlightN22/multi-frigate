import { Accordion, Text } from '@mantine/core';
import { Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
const EventsAccordion = lazy(() => import('./EventsAccordion'))

interface DayEventsAccordionProps {
    day: string,
    hour: string,
    qty?: number,
}

const DayEventsAccordion = ({
    day,
    hour,
    qty,
}: DayEventsAccordionProps) => {
    const { t } = useTranslation()
    const [openedItem, setOpenedItem] = useState<string>()

    const handleClick = (value: string | null) => {
        setOpenedItem(hour)
    }
    return (
        <Accordion onChange={handleClick}>
            <Accordion.Item value={hour}>
                <Accordion.Control><Text>{t('events')}: {qty}</Text></Accordion.Control>
                <Accordion.Panel>
                    {openedItem === hour ?
                        <Suspense>
                            <EventsAccordion day={day} hour={hour} />
                        </Suspense>
                        : <></>
                    }
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default DayEventsAccordion;