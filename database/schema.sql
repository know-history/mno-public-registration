CREATE TABLE public.additional_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    person_id uuid NOT NULL,
    related_person_id uuid NOT NULL,
    relationship_label text NOT NULL,
    notes text
);

ALTER TABLE public.additional_relationships OWNER TO mnoadmin;

CREATE TABLE public.address_change_forms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    citizenship_number text,
    want_replacement_card boolean,
    want_change_name boolean,
    gender_id integer,
    another_gender_value text
);

ALTER TABLE public.address_change_forms OWNER TO mnoadmin;

CREATE TABLE public.application_statuses (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL
);

ALTER TABLE public.application_statuses OWNER TO mnoadmin;

CREATE SEQUENCE public.application_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.application_statuses_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.application_statuses_id_seq OWNED BY public.application_statuses.id;

CREATE TABLE public.application_types (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL,
    parent_type_id integer
);

ALTER TABLE public.application_types OWNER TO mnoadmin;

CREATE SEQUENCE public.application_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.application_types_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.application_types_id_seq OWNED BY public.application_types.id;

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type_id integer,
    status_id integer,
    airtable_ticket_id text,
    finalized_date timestamp without time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.applications OWNER TO mnoadmin;

CREATE TABLE public.citizenship_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    subtype_id integer,
    transfer_status text
);

ALTER TABLE public.citizenship_applications OWNER TO mnoadmin;

CREATE TABLE public.contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    person_id uuid,
    street_address text,
    unit text,
    po_box text,
    rr text,
    city text,
    province text,
    postal_code text,
    telephone1 text,
    telephone2 text,
    email text,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.contacts OWNER TO mnoadmin;

CREATE TABLE public.document_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    document_id uuid,
    person_id uuid,
    application_id uuid,
    relation_description text
);

ALTER TABLE public.document_relationships OWNER TO mnoadmin;

CREATE TABLE public.document_types (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL
);

ALTER TABLE public.document_types OWNER TO mnoadmin;

CREATE SEQUENCE public.document_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.document_types_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.document_types_id_seq OWNED BY public.document_types.id;

CREATE TABLE public.documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    s3_key text NOT NULL,
    file_name text,
    original_file_name text,
    type_id integer,
    description text,
    uploaded_by uuid,
    deleted_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.documents OWNER TO mnoadmin;

CREATE TABLE public.family_relationships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    person_id uuid NOT NULL,
    related_person_id uuid NOT NULL,
    relationship_type_id integer,
    notes text
);

ALTER TABLE public.family_relationships OWNER TO mnoadmin;

CREATE TABLE public.gender_types (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL
);

ALTER TABLE public.gender_types OWNER TO mnoadmin;

CREATE SEQUENCE public.gender_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.gender_types_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.gender_types_id_seq OWNED BY public.gender_types.id;

CREATE TABLE public.harvesting_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    region_id uuid,
    captain_id uuid,
    tht_id uuid,
    subtype_id integer,
    purpose_id integer,
    use_firearm boolean,
    denial_reason text
);

ALTER TABLE public.harvesting_applications OWNER TO mnoadmin;

CREATE TABLE public.harvesting_captains (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    region_id uuid,
    title text,
    notes text,
    first_name text,
    last_name text,
    email text,
    phonenumber text,
    address text,
    toll_free text
);

ALTER TABLE public.harvesting_captains OWNER TO mnoadmin;

CREATE TABLE public.harvesting_regions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    is_enabled boolean DEFAULT true
);

ALTER TABLE public.harvesting_regions OWNER TO mnoadmin;

CREATE TABLE public.harvesting_territories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    region_id uuid,
    code text NOT NULL,
    is_enabled boolean DEFAULT true
);

ALTER TABLE public.harvesting_territories OWNER TO mnoadmin;

CREATE TABLE public.persons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    first_code text NOT NULL,
    middle_name text,
    last_code text NOT NULL,
    maiden_name text,
    gender_id integer,
    another_gender_value text,
    birth_date date,
    email text,
    is_metis boolean DEFAULT false,
    citizenship_number text,
    birth_place text,
    death_place text,
    death_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.persons OWNER TO mnoadmin;

CREATE TABLE public.harvesting_purposes (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL
);

ALTER TABLE public.harvesting_purposes OWNER TO mnoadmin;

CREATE SEQUENCE public.harvesting_purposes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.harvesting_purposes_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.harvesting_purposes_id_seq OWNED BY public.harvesting_purposes.id;

CREATE TABLE public.relationship_types (
    id integer NOT NULL,
    code text NOT NULL,
    html_value_en text NOT NULL,
    html_value_fr text NOT NULL
);

ALTER TABLE public.relationship_types OWNER TO mnoadmin;

CREATE SEQUENCE public.relationship_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.relationship_types_id_seq OWNER TO mnoadmin;

ALTER SEQUENCE public.relationship_types_id_seq OWNED BY public.relationship_types.id;

CREATE TABLE public.signature_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid,
    document_id uuid,
    document_type text,
    signature_status text,
    sent_on timestamp without time zone,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.signature_documents OWNER TO mnoadmin;

CREATE TABLE public.signers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    signature_document_id uuid,
    person_id uuid,
    role text,
    signed_on timestamp without time zone
);

ALTER TABLE public.signers OWNER TO mnoadmin;

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cognito_sub uuid NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.users OWNER TO mnoadmin;

ALTER TABLE ONLY public.application_statuses ALTER COLUMN id SET DEFAULT nextval('public.application_statuses_id_seq'::regclass);

ALTER TABLE ONLY public.application_types ALTER COLUMN id SET DEFAULT nextval('public.application_types_id_seq'::regclass);

ALTER TABLE ONLY public.document_types ALTER COLUMN id SET DEFAULT nextval('public.document_types_id_seq'::regclass);

ALTER TABLE ONLY public.gender_types ALTER COLUMN id SET DEFAULT nextval('public.gender_types_id_seq'::regclass);

ALTER TABLE ONLY public.harvesting_purposes ALTER COLUMN id SET DEFAULT nextval('public.harvesting_purposes_id_seq'::regclass);

ALTER TABLE ONLY public.relationship_types ALTER COLUMN id SET DEFAULT nextval('public.relationship_types_id_seq'::regclass);

-- Dependencies: 236
