export default interface UseCase<Input, Output> {
  execute(input: Input): Output | Promise<Output>;
}
