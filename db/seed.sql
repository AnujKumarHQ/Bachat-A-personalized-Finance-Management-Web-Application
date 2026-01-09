    -- Seed data for categories and sample transactions
    -- IMPORTANT: Replace the placeholders below BEFORE running in Supabase SQL editor.
    -- 1) Find your user id: select id, email from auth.users;
    -- 2) Replace {{USER_ID}}, {{USER_EMAIL}}, {{USER_NAME}} accordingly.

    -- TODO: Replace placeholders below
    insert into public.profiles (id, email, full_name)
    values ('{{USER_ID}}'::uuid, '{{USER_EMAIL}}', '{{USER_NAME}}')
    on conflict (id) do update set email = excluded.email, full_name = excluded.full_name;

    -- Default categories
    insert into public.categories (profile_id, name, type, icon) values
    ('{{USER_ID}}'::uuid,'Salary','income','briefcase'),
    ('{{USER_ID}}'::uuid,'Interest','income','piggy-bank'),
    ('{{USER_ID}}'::uuid,'Food','expense','utensils'),
    ('{{USER_ID}}'::uuid,'Transport','expense','car'),
    ('{{USER_ID}}'::uuid,'Rent','expense','home')
    returning id;

    -- You can optionally insert a few transactions (adjust amounts & dates)
    -- Note: ensure category ids exist for this user if you reference them.
    -- Here we insert without category_id as a simple example
    insert into public.transactions (profile_id, amount, type, note, occurred_at) values
    ('{{USER_ID}}'::uuid, 1500.00, 'income', 'Monthly salary', now() - interval '10 days'),
    ('{{USER_ID}}'::uuid, 25.50, 'expense', 'Lunch', now() - interval '2 days'),
    ('{{USER_ID}}'::uuid, 7.80, 'expense', 'Bus fare', now() - interval '1 day');
