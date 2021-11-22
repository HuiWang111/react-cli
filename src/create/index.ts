import path from 'path';
import { Question } from './question';
import { ReactDOMProject, ReactNativeProject } from './projects';
import { Creatable } from './interface';

export async function createReactProject(templeteDir: string) {
    try {
        const question = new Question();
        await question.getTempletes(templeteDir);
        const answers = await question.ask();
        
        let platform = 'React-DOM';
        if (answers.templete.startsWith('react-native')) {
            platform = 'React-Native';
        }
        
        let project: Creatable | undefined;
        if (platform === 'React-DOM') {
            project = new ReactDOMProject(
                path.join(process.cwd(), answers.projectName),
                answers.projectName,
                answers.templete,
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