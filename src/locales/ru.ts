const ru = {
    mainPage: {
        createSelectTags: 'Создай\\Выбери тэги',
        tagsError: 'Не может быть более 10 символов',
    },
    editCameraPage: {
        notFrigateCamera: 'Не камера Фригата',
        errorAtPut: 'Ошибка при отправке маски',
        cameraIdNotExist: 'ID камеры не найдено',
        cameraConfigNotExist: 'Конфиг. камеры не найден',
        width: 'Ширина',
        height: 'Высота',
        points: 'Точки',
    },    
    eventsPage: {
        selectStartTime: 'Выбери время начала:',
        selectEndTime: 'Выбери время окончания:',
        maxEventsFetches: 'Ошибка: Невозможно получить события после {{maxRetries}} попыток. Пожалуйста попробуйте позже или установите меньший период.',
    },
    frigateConfigPage: {
        copyConfig: 'Копировать Конфиг.',
        saveOnly: 'Только Сохранить',
        saveAndRestart: 'Сохранить & Перезагрузить',
        editorNotExist: 'Редактор не найден',
    },
    settingsPage: {
        oidpClientId: 'OIDP ID клиента',
        oidpClientIdPH: 'frigate-cli',
        clientSecret: 'OIDP секрет клиента',
        clientSecretPH: 'супер секретный пароль от клиента OIDP сервера',
        clientUsername: 'OIDP имя пользователя',
        clientUsernamePH: 'frigate-admin@yourmail.com',
        clientPassword: 'OIDP пароль',
        clientPasswordPH: 'Пароль пользователя на OIDP сервере',
        realmUrl: 'OIDP realm URL путь',
        realmUrlPH: 'https://your.oidp.server.com/realms/frigate-realm',
        adminRole: 'Выбери роль администратора',
        birdseyeRole: 'Выбери роль birdseye пользователя',
        emptyRolesNotify: 'Список ролей пуст. Вы можете вручную запустить обновление на сервере:',
        updateRoles: 'Обновить роли',
    },
    systemPage: {
        cameraStats: 'Статистика Камер',
        storageStats: 'Статистика Хранения',
    },
    detectorCard: {
        pid: 'PID',
        inferenceSpeed: 'Скорость вывода',
        memory: 'Память',
    },
    gpuStatCard: {
        gpu: 'GPU',
        memory: 'Память',
        decoder: 'Декодер',
        encoder: 'Кодер',
    },
    cameraStorageTable: {
        usage: 'Занято',
        usagePercent: 'Занято %',
        sreamBandwidth: 'Скорость потока',
        total: 'Итого',
    },
    cameraStatTable: {
        process: 'Процесс',
        pid: 'PID',
        fps: 'FPS',
        cpu: 'CPU %',
        memory: 'Память %'
    },
    hostMenu: {
        editConfig: 'Редакт. конфиг.',
        restart: 'Перезагрузка',
        system: 'Система',
        storage: 'Хранилище',
    },
    header: {
        home: 'Главная',
        settings: 'Настройки',
        recordings: 'Записи',
        events: 'События',
        hostsConfig: 'Серверы Frigate',
        acessSettings: 'Настройка доступа',
    },
    hostArr: {
        host: 'Хост',
        name: 'Имя хоста',
        url: 'Адрес',
        enabled: 'Включен',
    },
    player: {
        startVideo: 'Вкл. Видео',
        stopVideo: 'Выкл. Видео',
        object: 'Объект',
        duration: 'Длительность',
        startTime: 'Начало',
        endTime: 'Конец',
        doubleClickToFullHint: 'Двойное нажатие мышью для полноэкранного просмотра',
        rating: 'Рейтинг',
    },
    config: 'Конфиг.',
    create: 'Создать',
    clear: 'Очистить',
    edit: 'Изменить',
    version: 'Версия',
    uptime: 'Время работы',
    pleaseSelectRole: 'Пожалуйста выберите роль',
    pleaseSelectHost: 'Пожалуйста выберите хост',
    pleaseSelectCamera: 'Пожалуйста выберите камеру',
    pleaseSelectDate: 'Пожалуйста выберите дату',
    nothingHere: 'Ничего нет',
    allowed: 'Разрешено',
    notAllowed: 'Не разрешено',
    camera: 'Камера',
    camersDoesNotExist: 'Камер нет',
    search: 'Поиск',
    recordings: 'Записи',
    day: 'День',
    hour: 'Час',
    minute: 'Минута',
    second: 'Час',
    events: 'События',
    notHaveEvents: 'Событий нет',
    notHaveEventsAtThatPeriod: 'Нет событий за этот период',
    selectHost: 'Выбери хост',
    selectCamera: 'Выбери камеру',
    selectRange: 'Выбери период',
    changeTheme: "Изменить тему",
    logout: "Выйти",
    enterQuantity: "Введите количество:",
    quantity: "Количество",
    tooltipСlose: "Нажмите Enter",
    hide: "Скрыть",
    confirm: "Подтвердить",
    save: "Сохранить",
    discard: "Отменить",
    next: "Далее",
    back: "Назад",
    goToMainPage: "Вернуться на главную",
    retry: "Повторить",
    youCanRetryOrGoToMain: "Вы можете повторить или вернуться на главную",
    successfully: "Успешно",
    successfullySaved: "Успешно сохранено",
    successfullyUpdated: "Успешно обновлено",
    error: "Ошибка",
    errors: {
        emptyResponse: 'Пустой ответ',
        somthingGoesWrong: "Что-то пошло не так",
        403: "Извините, у вас нет доступа",
        404: "Извините, мы не можем найти такую страницу",
    }
}

export default ru