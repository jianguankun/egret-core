
/**
 * ResourceManager 配置文件
 */
type ResourceManagerConfig = {
    /**
     * 配置文件生成路径
     */
    configPath: string,
    /**
     * 资源根目录路径
     */
    resourceRoot: () => string,
    /**
     * 构建与发布配置
     */
    buildConfig: (param: BuildConfigParam) => UserConfig,
    /**
     * 设置资源类型
     */
    typeSelector: (path: string) => (string | null | undefined)
    /**
     * 设置资源的合并策略
     */
    mergeSelector?: (path: string) => (string | null | undefined),
    /**
     * 设置资源的命名策略
     * beta 功能，请勿随意使用
     */
    nameSelector?: (path: string) => (string | null | undefined)
}
/**
 * 构建配置
 */
type UserConfig = {
    /**
     * 输出路径
     */
    outputDir: string,
    /**
     * 插件
     */
    commands: (string | plugins.Command)[]
}

type BuildConfigParam = {


    /**
     * 当前命令，build 或者 command
     */
    readonly command: string;

    /**
     * 发布平台
     */
    readonly target: string;

    /**
     * 开发者指定的版本号
     */
    readonly version: string;

    /**
     * 项目名称
     */
    readonly projectName: string;
}


declare namespace plugins {

    interface CommandContext {

        /**
         * 可以用此接口进行文件创建
         */
        createFile(relativeFilePath: string, contents: Buffer);

        /**
         * 构建配置
         */
        buildConfig: BuildConfigParam

    }

    /**
     * 构建管线命令
     */
    interface Command {

        /**
         * 项目中的每个文件都会执行此函数，返回 file 表示保留此文件，返回 null 表示将此文件从构建管线中删除，即不会发布
         */
        onFile?(file: File): Promise<File | null>

        /**
         * 项目中所有文件均执行完后，最终会执行此函数。
         * 这个函数主要被用于创建新文件
         */
        onFinish?(pluginContext?: CommandContext): Promise<void>

        [options: string]: any;
    }

    interface File {

        /**
         * 文件内容的二进制流，如果开发者需要修改文件内容，请修改此属性
         */
        contents: Buffer;


        /**
         * 文件绝对路径，如果开发者需要对文件进行重命名，请修改此属性
         */
        path: string;

        /**
         * 文件所在的项目的项目路径
         */
        readonly base: string;

        /**
         * 文件的相对于 base 属性的相对路径
         */
        readonly relative: string;


        /**
         * 文件变更历史，history[0] 即 origin 属性
         */
        readonly history: ReadonlyArray<string>;


        /**
         * 文件所在的文件夹的绝对路径
         */
        readonly dirname: string;

        /**
         * 文件的文件名
         */
        readonly basename: string;


        /**
         * 文件的扩展名
         */
        readonly extname: string;

        /**
         * 文件的初始文件名
         */
        readonly origin: string;

        /**
         * 其他自定义属性
         */
        [customProperty: string]: any;

    }

}










declare module 'built-in' {

    /**
     * 混淆插件参数，设置源代码和目标代码
     */
    type UglifyPluginOption = { sources: string[], target: string };

    type UglifyPluginOptions = UglifyPluginOption[];

    /**
     * 混淆插件
     */
    export class UglifyPlugin implements plugins.Command {

        constructor(mergeSelector: UglifyPluginOptions);

    }


    type LibraryType = "debug" | "release";

    type CompilePluginOptions = { libraryType: LibraryType };
    /**
     * 编译命令
     */
    export class CompilePlugin implements plugins.Command {

        constructor(options: CompilePluginOptions);
    }

    /**
     * EXML 插件，用于发布 EXML 文件
     */
    export class ExmlPlugin implements plugins.Command {

        constructor(publishPolicy: EXML_Publish_Policy);

    }

    /**
     * 发布策略
     * * default : 使用 egretProperties.json 中的 exmlPublishPolicy 中的策略
     * * debug : 默认策略，用于开发环境
     * * contents : 将 EXML 的内容写入到主题文件中
     * * gjs : 将生成的JS文件写入到主题文件中
     * * commonjs : 将EXML合并为一个 CommonJS 风格的文件(暂未开放)
     */
    type EXML_Publish_Policy = "default" | "debug" | "contents" | "gjs" | "commonjs"




    /**
     * 生成 manifest 文件，这个文件会被用于记录 JavaScript 文件的版本号
     */
    export class ManifestPlugin implements plugins.Command {
        constructor(options?: ManifestPluginOptions)
    }

    /**
     * 生成文件的文件名
     * 支持 json 与 js 两种格式
     */
    type ManifestPluginOptions = {

        output: string
    }


    /**
     * 增量编译
     * 这个功能将会在未来被 watch 模式代替掉
     */
    export class IncrementCompilePlugin implements plugins.Command {

    }


    /**
     * 自动纹理合并，beta
     */
    export class SpriteSheetPlugin implements plugins.Command {

    }

}