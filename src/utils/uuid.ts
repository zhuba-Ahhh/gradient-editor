export function uuid(pre = 'u_'): string {
  return pre + Date.now().toString(36) + Math.floor(Math.random() * 10000).toString(36);
}
