require.config({
    'baseUrl': 'scripts',
    paths: {
        'jquery': [
            '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min', 
            'x-ternal/jquery-1.11.0.min' // local fallback
        ],
        'bootstrap': [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
            'x-ternal/bootstrap.min' // local fallback
        ],
        'bootstrapValidator': [
            '//cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.0/js/bootstrapValidator.min',
            'x-ternal/bootstrapValidator.min'  // local fallback
        ],
        'modernizr': 'x-ternal/modernizr.custom',
        'configurationService': 'services/configurationService',
        'utilitiesService': 'services/utilitiesService',
        'boardService': 'services/boardService',
        'timerService': 'services/timerService',
        'dataService': 'services/dataService',
        'uiService': 'services/uiService',
        'pubsubService': 'services/pubsubService',
        'validationService': 'services/validationService',
        'options': 'domain/options',
        'square': 'domain/square',
        'board': 'domain/board',
        'game': 'domain/game',
        'minefield': 'ui/minefield',
        'controller': 'ui/controller',
        'minesweeper': 'ui/minesweeper'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrapValidator': {
            deps: ['jquery']
        }
    }
});