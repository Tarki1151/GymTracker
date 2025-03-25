--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    action text NOT NULL,
    description text NOT NULL,
    entity_id integer,
    entity_type text,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activity_logs OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO neondb_owner;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    member_id integer NOT NULL,
    check_in_time timestamp without time zone NOT NULL,
    check_out_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.attendance OWNER TO neondb_owner;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO neondb_owner;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: equipment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    purchase_date date,
    purchase_price numeric(10,2),
    maintenance_date date,
    status text DEFAULT 'operational'::text NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.equipment OWNER TO neondb_owner;

--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipment_id_seq OWNER TO neondb_owner;

--
-- Name: equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.members (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text,
    date_of_birth date,
    gender text,
    emergency_contact text,
    emergency_phone text,
    notes text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.members OWNER TO neondb_owner;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_id_seq OWNER TO neondb_owner;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: membership_plans; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.membership_plans (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    duration integer NOT NULL,
    price numeric(10,2) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.membership_plans OWNER TO neondb_owner;

--
-- Name: membership_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.membership_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membership_plans_id_seq OWNER TO neondb_owner;

--
-- Name: membership_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.membership_plans_id_seq OWNED BY public.membership_plans.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    member_id integer NOT NULL,
    subscription_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date date NOT NULL,
    payment_method text NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payments OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO neondb_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.settings OWNER TO neondb_owner;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO neondb_owner;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    member_id integer NOT NULL,
    plan_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subscriptions OWNER TO neondb_owner;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'staff'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: equipment id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: membership_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.membership_plans ALTER COLUMN id SET DEFAULT nextval('public.membership_plans_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activity_logs (id, action, description, entity_id, entity_type, "timestamp") FROM stdin;
1	plan_added	New membership plan added: Temel Aylık	1	membership_plans	2025-03-23 23:17:27.463
2	plan_added	New membership plan added: Premium Aylık	2	membership_plans	2025-03-23 23:17:27.929
3	plan_added	New membership plan added: Temel Yıllık	3	membership_plans	2025-03-23 23:17:27.989
4	plan_added	New membership plan added: Elite Üç Aylık	4	membership_plans	2025-03-23 23:17:28.061
5	equipment_added	New equipment added: Boks Eldiveni	1	equipment	2025-03-23 23:17:28.382
6	equipment_added	New equipment added: Kum Torbası	2	equipment	2025-03-23 23:17:28.437
7	equipment_added	New equipment added: Dövüş Minderi	3	equipment	2025-03-23 23:17:28.494
8	equipment_added	New equipment added: Muay Thai Şortu	4	equipment	2025-03-23 23:17:28.55
9	equipment_added	New equipment added: Koşu Bandı	5	equipment	2025-03-23 23:17:28.606
10	member_added	New member added: Ahmet Yılmaz	1	members	2025-03-23 23:17:28.693
11	member_added	New member added: Zeynep Kaya	2	members	2025-03-23 23:17:28.749
12	member_added	New member added: Murat Demir	3	members	2025-03-23 23:17:28.806
13	member_added	New member added: Ayşe Şahin	4	members	2025-03-23 23:17:28.863
14	member_added	New member added: Kemal Öztürk	5	members	2025-03-23 23:17:28.921
15	check_in	Zeynep Kaya checked in	1	attendance	2025-03-24 05:34:19.457
16	check_out	Zeynep Kaya checked out	1	attendance	2025-03-24 05:41:59.931
17	plan_added	New membership plan added: 10 Ders Paket	5	membership_plans	2025-03-25 11:59:32.77
18	check_in	Murat Demir checked in	2	attendance	2025-03-25 12:02:32.815
19	check_in	Murat Demir checked in	3	attendance	2025-03-25 12:02:34.519
20	check_out	Murat Demir checked out	2	attendance	2025-03-25 12:02:38.945
21	member_updated	Member updated: Ahmet Yılmaz	1	members	2025-03-25 12:07:58.786
22	member_updated	Member updated: Kemal Öztürk	5	members	2025-03-25 12:08:02.493
23	payment_received	Payment received from Zeynep Kaya: $100	1	payments	2025-03-25 12:09:02.2
24	payment_received	Payment received from Ahmet Yılmaz: $5000	2	payments	2025-03-25 12:17:48.818
25	check_in	Ahmet Yılmaz checked in	4	attendance	2025-03-26 15:01:45.94
26	check_in	Ahmet Yılmaz checked in	5	attendance	2025-03-26 15:01:47.42
27	check_out	Ahmet Yılmaz checked out	4	attendance	2025-03-26 15:01:53.769
28	check_out	Murat Demir checked out	3	attendance	2025-03-26 15:01:57.778
29	check_out	Murat Demir checked out	3	attendance	2025-03-26 15:01:59.45
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.attendance (id, member_id, check_in_time, check_out_time, created_at) FROM stdin;
1	2	2025-03-24 05:34:18.955	2025-03-24 05:41:59.672	2025-03-24 05:34:19.164
2	3	2025-03-25 12:02:29.799	2025-03-25 12:02:38.588	2025-03-25 12:02:30.094
5	1	2025-03-26 15:01:46.246	\N	2025-03-26 15:01:47.356
4	1	2025-03-26 15:01:44.387	2025-03-26 15:01:52.587	2025-03-26 15:01:45.865
3	3	2025-03-25 12:02:31.941	2025-03-26 15:01:58.307	2025-03-25 12:02:32.248
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.equipment (id, name, category, purchase_date, purchase_price, maintenance_date, status, notes, created_at) FROM stdin;
1	Boks Eldiveni	Boks Ekipmanı	2024-01-15	1500.00	2024-06-15	İyi Durumda	Yeni alındı, sınıf kullanımı için	2025-03-23 23:17:28.352
2	Kum Torbası	Boks Ekipmanı	2023-11-20	3500.00	2024-05-20	İyi Durumda	Ağır kullanım için dayanıklı, 50kg	2025-03-23 23:17:28.409
3	Dövüş Minderi	Güreş/BJJ Ekipmanı	2023-08-10	25000.00	2024-08-10	İyi Durumda	10x10 metre, sınıf kullanımı için	2025-03-23 23:17:28.465
4	Muay Thai Şortu	Giyim	2024-02-05	800.00	\N	İyi Durumda	Çeşitli boyutlarda mevcut	2025-03-23 23:17:28.522
5	Koşu Bandı	Kardio Ekipmanı	2022-05-15	15000.00	2024-03-01	Tamir Gerekli	Ekran arızalı, tamir için bakımda	2025-03-23 23:17:28.578
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.members (id, full_name, email, phone, address, date_of_birth, gender, emergency_contact, emergency_phone, notes, active, created_at) FROM stdin;
2	Zeynep Kaya	zeynep@example.com	+90 555 222 3344	Kadıköy, İstanbul	1995-08-20	Kadın	Mehmet Kaya	+90 555 222 3345	BJJ ve Kickbox derslerine katılıyor	t	2025-03-23 23:17:28.721
3	Murat Demir	murat@example.com	+90 555 333 4455	Sarıyer, İstanbul	1990-02-10	Erkek	Selin Demir	+90 555 333 4456	Yalnızca akşam antrenmanlarına katılabiliyor	t	2025-03-23 23:17:28.777
4	Ayşe Şahin	ayse@example.com	+90 555 444 5566	Bakırköy, İstanbul	1997-11-25	Kadın	Ali Şahin	+90 555 444 5567	Muay Thai üzerine yoğunlaşıyor	t	2025-03-23 23:17:28.834
1	Ahmet Yılmaz	ahmet@example.com	+90 555 111 2233	Beşiktaş, İstanbul	1992-05-15	male	Ayşe Yılmaz	+90 555 111 2234	Boks ve MMA ile ilgileniyor	t	2025-03-23 23:17:28.663
5	Kemal Öztürk	kemal@example.com	+90 555 555 6677	Taksim, İstanbul	1988-07-30	Erkek	Deniz Öztürk	+90 555 555 6678	Eski profesyonel boksör, şimdi hobi olarak devam ediyor	t	2025-03-23 23:17:28.892
\.


--
-- Data for Name: membership_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.membership_plans (id, name, description, duration, price, active, created_at) FROM stdin;
1	Temel Aylık	Standart ekipman erişimi ile temel spor salonu girişi	30	500.00	t	2025-03-23 23:17:26.975
2	Premium Aylık	Tüm spor salonu tesislerine ve derslere tam erişim	30	800.00	t	2025-03-23 23:17:27.884
3	Temel Yıllık	Standart ekipman erişimi ile temel spor salonu girişi, yıllık indirim	365	5000.00	t	2025-03-23 23:17:27.96
4	Elite Üç Aylık	Kişisel antrenör seansları ile tüm tesislere tam erişim	90	2000.00	t	2025-03-23 23:17:28.017
5	10 Ders Paket	Haftada en az 2 olmak üzere toplam 10 derslik paket	30	300.00	t	2025-03-25 11:59:32.521
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payments (id, member_id, subscription_id, amount, payment_date, payment_method, notes, created_at) FROM stdin;
1	2	0	100.00	2025-03-25	cash		2025-03-25 12:09:01.946
2	1	0	5000.00	2025-03-25	cash		2025-03-25 12:17:48.533
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
db1FA4ZeOwoPrh6OqyKkFqqUcupr7A62	{"cookie":{"originalMaxAge":604800000,"expires":"2025-03-31T05:32:40.886Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-03-31 05:32:41
nXAGRr7q7tK0lNfeq2Y-2O79WiqTNQY5	{"cookie":{"originalMaxAge":604800000,"expires":"2025-03-31T05:34:04.141Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-03-31 05:34:05
XBzx06-WxjvzOZGo6IyFcAGA0hi_b3Mm	{"cookie":{"originalMaxAge":604800000,"expires":"2025-03-31T05:41:33.076Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-03-31 05:41:34
IwtMm3b2_Qf2-XKWO94Fh0WLS1V5hJZk	{"cookie":{"originalMaxAge":604800000,"expires":"2025-03-31T05:53:06.400Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-03-31 05:53:07
OQ67wtZNFK-Z5XKQOB7KU7RXJ_ZDg5QY	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T11:50:55.436Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 11:50:56
6wiqu2hLoHhq829WArcI0eQlVAdvkQZM	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T11:58:30.679Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 11:58:31
JEX0ox9LOyGYfSU_J82sKuG1GfA_oAb8	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:07:40.309Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:07:41
ivDhbYkiN_qmzUKh6h1tf1ZHlL3ivKKV	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:12:21.644Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:12:22
OZ6HnjvF9EXp_gcraitOdh1u8CUr7jeq	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:16:09.203Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:16:10
Fljz53KINPRNCUCFr9TxHZtrNMI8F_Ol	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:17:14.786Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:17:15
ABway3oFVrIY6QEuO-s5DeHb-iS1pM53	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:19:19.458Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:19:20
Lpm2IAcVr7ul4V_v1aemANbmW3S9_QYR	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-01T12:29:56.957Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-01 12:29:57
TNMEJG2rab7k7fWycNN1ihcN-prK3wRe	{"cookie":{"originalMaxAge":604800000,"expires":"2025-04-02T15:00:55.649Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2025-04-02 15:02:32
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.settings (id, key, value, updated_at) FROM stdin;
3	contactPhone	+90 555 123 4567	2025-03-23 23:17:28.239
4	address	Tarabya, İstanbul, Türkiye	2025-03-23 23:17:28.294
1	appName	Tarabya Marte	2025-03-25 12:31:33.042
5	businessHours	8:00 AM - 10:00 PM	2025-03-25 12:31:33.772
2	contactEmail	info@tarabyamarte.com	2025-03-25 12:31:34.186
6	maintenanceMode	false	2025-03-25 12:31:34.414
7	currency	TRY	2025-03-25 12:31:34.644
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscriptions (id, member_id, plan_id, start_date, end_date, status, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, full_name, email, role, created_at) FROM stdin;
1	admin	b729111af1a21b49a74223aca659c4603a046ffde8e03c8ec631bfd04698af512b3134a5e00e2b2f124aea04485dfbed91a8c1b70313eb9191eeae409f2cdd7a.9f31f5ae6e5968c6f54cd18527e4b98a	Admin User	admin@gymify.com	admin	2025-03-23 23:17:27.8
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 29, true);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.attendance_id_seq', 5, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.equipment_id_seq', 5, true);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.members_id_seq', 5, true);


--
-- Name: membership_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.membership_plans_id_seq', 5, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payments_id_seq', 2, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.settings_id_seq', 7, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: membership_plans membership_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.membership_plans
    ADD CONSTRAINT membership_plans_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: settings settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

