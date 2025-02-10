import { pipeline } from "@huggingface/transformers";

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
const P = () => class PipelineSingleton {
  static task = 'text-generation';
  // static model = 'Xenova/distilbert-base-cased-distilled-squad';
  static model = 'Xenova/gpt2';
  static instance = null;
  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

let PipelineSingleton;
if (process.env.NODE_ENV !== 'production') {
  // When running in development mode, attach the pipeline to the
  // global object so that it's preserved between hot reloads.
  if (!global.PipelineSingleton) {
    global.PipelineSingleton = P();
  }
  PipelineSingleton = global.PipelineSingleton;
} else {
  PipelineSingleton = P();
}
export default PipelineSingleton;
