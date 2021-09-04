import path from 'path';
import { Question } from './question';
import { ReactDOMProject, ReactNativeProject } from './projects';
import { Project } from './interface';

export async function createReactProject() {
    try {
        const answers = await (new Question()).ask();
        
        let project: Project | undefined;
        if (answers.env === 'React-DOM') {
            project = new ReactDOMProject(
                path.join(process.cwd(), answers.projectName),
                answers.projectName,
                answers.stateManagement
            );
        } else {
            project = new ReactNativeProject(
                path.join(process.cwd(), answers.projectName),
                answers.projectName
            );
        }

        await project?.create();
    } catch (e) {
        console.error(e);
    }
}