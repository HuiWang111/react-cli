import path from 'path';
import { Question } from './question';
import { ReactDOMProject, ReactNativeProject } from './projects';
import { Creatable } from './interface';

export async function createReactProject(templeteDir: string) {
    try {
        const answers = await (new Question()).ask();
        
        let project: Creatable | undefined;
        if (answers.platform === 'React-DOM') {
            project = new ReactDOMProject(
                path.join(process.cwd(), answers.projectName),
                answers.projectName,
                answers.stateManagement,
                templeteDir
            );
        } else {
            project = new ReactNativeProject(
                path.join(process.cwd(), answers.projectName),
                answers.projectName,
                templeteDir
            );
        }

        await project?.create();
    } catch (e) {
        console.error(e);
    }
}