import { modals } from '../shared/components/modal.windows/modals'

declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof modals;
    }
}