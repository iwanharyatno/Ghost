import Service from '@ember/service';
import {inject as service} from '@ember/service';

export default class SuarLockService extends Service {
    @service ajax;
    @service ghostPaths;
    @service session;

    async lock(postId) {
        const url = this.ghostPaths.url.api(`posts/${postId}/suar-lock/`);

        try {
            await this.ajax.put(url, {
                headers: this.session.headers
            });
            console.info(`🔒 Post ${postId} locked successfully`);
        } catch (error) {
            console.error(`❌ Failed to lock post ${postId}`, error);
            // Optional: tampilkan notifikasi ke user
            // this.notifications.showAlert(`Failed to lock post: ${error.message}`, {type: 'error'});
        }
    }

    async unlock(postId) {
        const url = this.ghostPaths.url.api(`posts/${postId}/suar-unlock/`);

        try {
            await this.ajax.put(url, {
                headers: this.session.headers
            });
            console.info(`🔓 Post ${postId} unlocked successfully`);
        } catch (error) {
            console.error(`❌ Failed to unlock post ${postId}`, error);
        }
    }
}
