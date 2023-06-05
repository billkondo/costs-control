export type AuthenticationState = {
  authenticated: boolean;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
};
