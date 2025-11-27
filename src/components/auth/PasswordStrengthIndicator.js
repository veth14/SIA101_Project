import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PasswordStrengthIndicator = ({ password }) => {
    const calculateStrength = (pwd) => {
        let score = 0;
        const requirements = [
            { met: pwd.length >= 8, text: 'At least 8 characters' },
            { met: /[A-Z]/.test(pwd), text: 'One uppercase letter' },
            { met: /[a-z]/.test(pwd), text: 'One lowercase letter' },
            { met: /\d/.test(pwd), text: 'One number' },
            { met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd), text: 'One special character' }
        ];
        requirements.forEach(req => {
            if (req.met)
                score++;
        });
        let label = '';
        let color = '';
        if (score === 0) {
            label = '';
            color = 'bg-gray-200';
        }
        else if (score <= 2) {
            label = 'Weak';
            color = 'bg-red-500';
        }
        else if (score <= 3) {
            label = 'Fair';
            color = 'bg-orange-500';
        }
        else if (score <= 4) {
            label = 'Good';
            color = 'bg-yellow-500';
        }
        else {
            label = 'Strong';
            color = 'bg-green-500';
        }
        return { score, label, color, requirements };
    };
    const strength = calculateStrength(password);
    if (!password)
        return null;
    return (_jsxs("div", { className: "mt-2 space-y-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Password Strength" }), strength.label && (_jsx("span", { className: `font-bold ${strength.score <= 2 ? 'text-red-600' :
                                    strength.score <= 3 ? 'text-orange-600' :
                                        strength.score <= 4 ? 'text-yellow-600' :
                                            'text-green-600'}`, children: strength.label }))] }), _jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((level) => (_jsx("div", { className: `h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= strength.score ? strength.color : 'bg-gray-200'}` }, level))) })] }), _jsxs("div", { className: "p-2 space-y-1 rounded-lg bg-slate-50 border border-slate-200", children: [_jsx("p", { className: "text-xs font-semibold text-slate-700 mb-1", children: "Requirements:" }), _jsx("div", { className: "grid grid-cols-1 gap-1", children: strength.requirements.map((req, index) => (_jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [_jsx("div", { className: `flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 ${req.met ? 'bg-green-500' : 'bg-gray-300'}`, children: req.met && (_jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) })) }), _jsx("span", { className: `text-[11px] ${req.met ? 'text-green-700 font-medium' : 'text-slate-600'}`, children: req.text })] }, index))) })] })] }));
};
