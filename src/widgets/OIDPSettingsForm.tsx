import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';
import { frigateApi, frigateQueryKeys } from '../services/frigate.proxy/frigate.api';
import { OIDPConfig } from '../services/frigate.proxy/frigate.schema';
import RetryError from '../shared/components/RetryError';
import { FloatingLabelInput } from '../shared/components/inputs/FloatingLabelInput';
import CogwheelLoader from '../shared/components/loaders/CogwheelLoader';
import { Flex, Button } from '@mantine/core';
import { isProduction } from '../shared/env.const';
import { useEffect, useState } from 'react';

interface OIDPSettingsFormProps {
    isConfigValid?: (valid: boolean) => void
}

const OIDPSettingsForm: React.FC<OIDPSettingsFormProps> = ({
    isConfigValid
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const [config, setConfig] = useState<OIDPConfig>({
        clientId: '',
        clientSecret: '',
        clientUsername: '',
        clientPassword: '',
        clientURL: ''
    });

    const { isPending, isError, data, refetch } = useQuery<OIDPConfig>({
        queryKey: [frigateQueryKeys.getOIDPConfig],
        queryFn: frigateApi.getOIDPConfig,
    })

    useEffect(() => {
        if (data) {
            setConfig(data)
            const result = Object.values(data).every(field => field.trim() !== '')
            if (isConfigValid) isConfigValid(result)
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: (config: OIDPConfig) => frigateApi.putOIDPConfig(config).catch(error => {
            if (error.response && error.response.data) {
                return Promise.reject(error.response.data)
            }
            return Promise.reject(error)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [frigateQueryKeys.getOIDPConfig] })
            notifications.show({
                id: v4(),
                withCloseButton: true,
                autoClose: 5000,
                title: t('successfully'),
                message: t('successfullySaved'),
                color: 'green',
                icon: <IconCircleCheck />
            })
        },
        onError: (e) => {
            notifications.show({
                id: e.message,
                withCloseButton: true,
                autoClose: false,
                title: t('error'),
                message: e.message,
                color: 'red',
                icon: <IconAlertCircle />,
            })
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prevConfig) => ({
            ...prevConfig,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        mutation.mutate(config);
    }

    const handleDiscard = () => {
        if (!isProduction) console.log('Discard changes')
        refetch()
        if (data) setConfig(data)
    }

    if (isPending) return <CogwheelLoader />
    if (isError) return <RetryError onRetry={refetch} />

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FloatingLabelInput
                    name="clientId"
                    label={t('settingsPage.oidpClientId')}
                    value={config.clientId}
                    placeholder={t('settingsPage.oidpClientIdPH')}
                    encrypted={false}
                    onChange={handleInputChange}
                />
                <FloatingLabelInput
                    name="clientSecret"
                    label={t('settingsPage.clientSecret')}
                    value={config.clientSecret}
                    placeholder={t('settingsPage.clientSecretPH')}
                    encrypted={true}
                    onChange={handleInputChange}
                />
                <FloatingLabelInput
                    name="clientUsername"
                    label={t('settingsPage.clientUsername')}
                    value={config.clientUsername}
                    placeholder={t('settingsPage.clientUsernamePH')}
                    encrypted={false}
                    onChange={handleInputChange}
                />
                <FloatingLabelInput
                    name="clientPassword"
                    label={t('settingsPage.clientPassword')}
                    value={config.clientPassword}
                    placeholder={t('settingsPage.clientPasswordPH')}
                    encrypted={true}
                    onChange={handleInputChange}
                />
                <FloatingLabelInput
                    name="clientURL"
                    label={t('settingsPage.realmUrl')}
                    value={config.clientURL}
                    placeholder={t('settingsPage.realmUrlPH')}
                    encrypted={false}
                    onChange={handleInputChange}
                />
                <Flex w='100%' justify='stretch' wrap='nowrap' align='center' mt='lg'>
                    <Button w='100%' onClick={handleDiscard} m='0.5rem'>{t('discard')}</Button>
                    <Button w='100%' type="submit" m='0.5rem'>{t('confirm')}</Button>
                </Flex>
            </form>
        </>
    );
};

export default OIDPSettingsForm;