-- Migration 001: Initial Schema and Default Seed Data

\i ../schema.sql

-- Insert default device configurations
INSERT INTO device_configs (device_type, label, target_url, icon, is_active)
VALUES 
    ('pc', 'Login PC', 'http://localhost:3000/preview/pc', 'monitor', true),
    ('mobile', 'Login Mobile', 'http://localhost:3000/preview/mobile', 'smartphone', true),
    ('tv', 'Login TV', 'http://localhost:3000/preview/tv', 'tv', true)
ON CONFLICT (device_type) DO UPDATE 
SET label = EXCLUDED.label, target_url = EXCLUDED.target_url;

-- Insert default system configurations
INSERT INTO system_configs (config_key, config_value, description)
VALUES 
    ('channel_url', 'https://t.me/aus_updates', 'Telegram channel for Subscribe Channel button'),
    ('default_region', 'Australia (AU)', 'Default region assigned to new cards'),
    ('default_plan', 'Premium Ultra HD (4K)', 'Default subscription tier assigned to new cards'),
    ('session_duration_hours', '48', 'Duration before a generated pass expires')
ON CONFLICT (config_key) DO NOTHING;
