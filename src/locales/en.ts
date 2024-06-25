import { error } from "console"

const en = {
    editCameraPage: {
        notFrigateCamera: 'Not frigate camera',
        errorAtPut: 'Error at sending mask',
        cameraIdNotExist: 'Camera id does not exist',
        cameraConfigNotExist: 'Camera config does not exist',
        width: 'Width',
        height: 'Height',
        points: 'Points',
    },
    frigateConfigPage: {
        copyConfig: 'Copy Config',
        saveOnly: 'Save Only',
        saveAndRestart: 'Save & Restart',
        editorNotExist: 'Editor does not exists',
    },
    settingsPage: {
        oidpClientId: 'OIDP Client ID',
        oidpClientIdPH: 'frigate-cli',
        clientSecret: 'OIDP Client secret',
        clientSecretPH: 'super secret from OIDP server client',
        clientUsername: 'OIDP Client username',
        clientUsernamePH: 'frigate-admin@yourmail.com',
        clientPassword: 'OIDP Client password',
        clientPasswordPH: 'User password on OIDP server',
        realmUrl: 'OIDP realm URL path',
        realmUrlPH: 'https://your.oidp.server.com/realms/frigate-realm',
        adminRole: 'Select admin role',
        birdseyeRole: 'Select birds eye role user',
        emptyRolesNotify: 'List of roles are empty. You can manually start updating on server:',
        updateRoles: 'Update Roles',
    },
    systemPage: {
        cameraStats: 'Cameras stats',
        storageStats: 'Storages stats',
    },
    detectorCard: {
        pid: 'PID',
        inferenceSpeed: 'Inference Speed',
        memory: 'Memory',
    },
    gpuStatCard: {
        gpu: 'GPU',
        memory: 'Memory',
        decoder: 'Decoder',
        encoder: 'Encoder',
    },
    cameraStorageTable: {
        usage: 'Usage',
        usagePercent: 'Usage %',
        sreamBandwidth: 'Stream Bandwidth',
        total: 'Total',
    },
    cameraStatTable: {
        process: 'Process',
        pid: 'PID',
        fps: 'FPS',
        cpu: 'CPU %',
        memory: 'Memory %'
    },
    hostMenu: {
        editConfig: 'Edit config',
        restart: 'Restart',
        system: 'System',
        storage: 'Storage',
    }, 
    header: {
        home: 'Main',
        settings: 'Settings',
        recordings: 'Recordings',
        hostsConfig: 'Frigate servers',
        acessSettings: 'Access settings',
    }, 
    hostArr: {
        host: 'Host',
        name: 'Host name',
        url: 'Address',
        enabled: 'Enabled',
    },
    player: {
        startVideo: 'Enable Video',
        stopVideo: 'Disable Video',
        object: 'Object',
        duration: 'Duration',
        startTime: 'Start',
        endTime: 'End',
        doubleClickToFullHint: 'Double click for fullscreen',
        rating: 'Rating',
    },
    config: 'Config',
    clear: 'Clear',
    edit: 'Edit',
    version: 'Version',
    uptime: 'Uptime',
    pleaseSelectRole: 'Please select Role',
    pleaseSelectHost: 'Please select Host',
    pleaseSelectCamera: 'Please select Camera',
    pleaseSelectDate: 'Please select Date',
    nothingHere: 'Nothing here',
    allowed: 'Allowed',
    notAllowed: 'Not allowed',
    camera: 'Camera',
    camersDoesNotExist: 'No cameras',
    search: 'Search',
    recordings: 'Recordings',
    day: 'Day',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second',
    events: 'Events',
    notHaveEvents: 'No events',
    selectHost: 'Select host',
    selectCamera: 'Select Camera',
    selectRange: 'Select period',
    changeTheme: "Change theme",
    logout: "Logout",
    enterQuantity: "Enter quantity:",
    quantity: "Quantity",
    tooltipСlose: "Press Enter",
    hide: "Hide",
    confirm: "Confirm",
    save: "Save",
    discard: "Cancel",
    next: "Next",
    back: "Back",
    goToMainPage: "Return to main page",
    retry: "Retry",
    youCanRetryOrGoToMain: "You can retry or return to the main page",
    successfully: "Sucessfully",
    successfullySaved: "Sucessfully saved",
    successfullyUpdated: "Sucessfully updated",
    error: "Error",
    errors: {
        emptyResponse: 'Empty response',
        somthingGoesWrong: "Something went wrong",
        403: "Sorry, you do not have access",
        404: "Sorry, we cannot find that page",
    }
}

export default en