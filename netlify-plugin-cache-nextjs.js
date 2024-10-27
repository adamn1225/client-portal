import { save, restore } from '@netlify/cache-utils';

export async function onPreBuild({ utils }) {
    console.log('Restoring cache...');
    try {
        await restore('./.next/cache');
        console.log('Cache restored.');
    } catch (error) {
        utils.build.failBuild('Failed to restore cache', { error });
    }
}
export async function onPostBuild({ utils }) {
    console.log('Saving cache...');
    try {
        await save('./.next/cache');
        console.log('Cache saved.');
    } catch (error) {
        utils.build.failBuild('Failed to save cache', { error });
    }
}