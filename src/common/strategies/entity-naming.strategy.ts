import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class PrefixNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  constructor(private prefix?: string) {
    super();
  }

  tableName(className: string, customName: string): string {
    const prefix = this.prefix ? `${this.prefix}_` : '';
    return customName
      ? `${prefix}${customName}`
      : `${prefix}${className.toLocaleLowerCase()}`;
  }
}
