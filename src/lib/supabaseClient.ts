// Supabase REST Client Helper for Database Operations
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://default-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'default-anon-key';

export class SupabaseQueryBuilder implements PromiseLike<{ data: any; error: any }> {
  private table: string;
  private action: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectQuery: string = '*';
  private payload: any = null;
  private orderCol: string | null = null;
  private orderAsc: boolean = true;
  private eqFilters: Record<string, any> = {};

  constructor(table: string) {
    this.table = table;
  }

  select(query = '*') {
    if (this.action !== 'insert' && this.action !== 'update') {
      this.action = 'select';
    }
    this.selectQuery = query;
    return this;
  }

  insert(records: any[]) {
    this.action = 'insert';
    this.payload = records;
    return this;
  }

  update(values: any) {
    this.action = 'update';
    this.payload = values;
    return this;
  }

  eq(column: string, value: any) {
    this.eqFilters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAsc = options?.ascending ?? true;
    return this;
  }

  async execute(): Promise<{ data: any; error: any }> {
    try {
      if (this.action === 'insert') {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${this.table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(this.payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          return { data: null, error: { message: errText || 'Supabase REST insert error' } };
        }

        const data = await res.json();
        return { data, error: null };
      } else if (this.action === 'update') {
        let url = `${SUPABASE_URL}/rest/v1/${this.table}`;
        const queryParams = new URLSearchParams();
        Object.entries(this.eqFilters).forEach(([k, v]) => {
          queryParams.append(k, `eq.${v}`);
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(this.payload),
        });

        if (!res.ok) {
          const errText = await res.text();
          return { data: null, error: { message: errText || 'Supabase REST update error' } };
        }

        const data = await res.json().catch(() => null);
        return { data, error: null };
      } else {
        // select
        let url = `${SUPABASE_URL}/rest/v1/${this.table}?select=${encodeURIComponent(this.selectQuery)}`;
        if (this.orderCol) {
          url += `&order=${encodeURIComponent(this.orderCol)}.${this.orderAsc ? 'asc' : 'desc'}`;
        }
        Object.entries(this.eqFilters).forEach(([k, v]) => {
          url += `&${encodeURIComponent(k)}=eq.${encodeURIComponent(v)}`;
        });

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          return { data: null, error: { message: 'Supabase select error' } };
        }
        const data = await res.json();
        return { data, error: null };
      }
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Network error' } };
    }
  }

  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const supabase = {
  from: (tableName: string) => new SupabaseQueryBuilder(tableName),
  auth: {
    signInWithOAuth: async (options: { provider: string; options?: { redirectTo?: string } }) => {
      return { data: { provider: options.provider, url: options.options?.redirectTo || 'https://example.com' }, error: null };
    },
  },
};
