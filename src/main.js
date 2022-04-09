import { logger, setKey } from './utils'

$(() => {
    'use strict'
    logger.log('Launching')
    import('./allMods')
    setKey()
})
