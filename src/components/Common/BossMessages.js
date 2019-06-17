import {message} from 'antd';

function BossMessage(success, content, duration) {
    if (success) {
        message.success(content, duration)
    } else {
        message.error(content, duration)
    }
}

export {BossMessage}